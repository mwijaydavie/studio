import 'dart:async';

import 'package:audio_service/audio_service.dart';
import 'package:just_audio/just_audio.dart';

/// Owns playback independently of Flutter's screen lifecycle. AudioService
/// forwards this state to Android's media session, notification, headset and
/// lock-screen controls.
class AuraAudioHandler extends BaseAudioHandler with SeekHandler {
  AuraAudioHandler() {
    _player.playbackEventStream.listen(_publishPlaybackState);
    _player.sequenceStateStream.listen((sequenceState) {
      final tag = sequenceState.currentSource?.tag;
      if (tag is MediaItem) {
        _currentItem = tag;
        mediaItem.add(tag);
      }
    });
    _player.durationStream.listen((duration) {
      final item = _currentItem;
      if (item != null && duration != null && item.duration != duration) {
        final updated = item.copyWith(duration: duration);
        _currentItem = updated;
        mediaItem.add(updated);
      }
    });
  }

  final AudioPlayer _player = AudioPlayer();
  MediaItem? _currentItem;

  bool get isPlaying => _player.playing;
  Stream<Duration> get positionStream => _player.positionStream;

  Future<void> playQueue(List<MediaItem> items, {int startIndex = 0}) async {
    if (items.isEmpty) return;
    if (startIndex < 0 || startIndex >= items.length) {
      throw RangeError.index(startIndex, items, 'startIndex');
    }

    queue.add(List<MediaItem>.unmodifiable(items));
    final source = ConcatenatingAudioSource(
      useLazyPreparation: true,
      children: items.map(_sourceFor).toList(growable: false),
    );

    await _player.setAudioSource(
      source,
      initialIndex: startIndex,
      initialPosition: Duration.zero,
    );
    unawaited(_player.play().catchError((Object error) {
      playbackState.add(playbackState.value.copyWith(
        processingState: AudioProcessingState.error,
        errorCode: 1,
        errorMessage: error.toString(),
      ));
    }));
  }

  AudioSource _sourceFor(MediaItem item) {
    final uri = Uri.tryParse(item.id);
    if (uri == null || uri.scheme != 'https' || !uri.hasAuthority) {
      throw FormatException('Track must have a valid HTTPS audio URL.', item.id);
    }
    return AudioSource.uri(uri, tag: item);
  }

  @override
  Future<void> play() => _player.play();

  @override
  Future<void> pause() => _player.pause();

  @override
  Future<void> stop() async {
    await _player.stop();
    _currentItem = null;
    mediaItem.add(null);
    await super.stop();
  }

  @override
  Future<void> seek(Duration position) => _player.seek(position);

  @override
  Future<void> skipToNext() async {
    if (_player.hasNext) await _player.seekToNext();
  }

  @override
  Future<void> skipToPrevious() async {
    if (_player.hasPrevious) {
      await _player.seekToPrevious();
    } else {
      await _player.seek(Duration.zero);
    }
  }

  @override
  Future<void> skipToQueueItem(int index) async {
    if (index >= 0 && index < (_player.sequence?.length ?? 0)) {
      await _player.seek(Duration.zero, index: index);
      if (!_player.playing) await _player.play();
    }
  }

  @override
  Future<void> setRepeatMode(AudioServiceRepeatMode repeatMode) async {
    await _player.setLoopMode(switch (repeatMode) {
      AudioServiceRepeatMode.one => LoopMode.one,
      AudioServiceRepeatMode.all || AudioServiceRepeatMode.group => LoopMode.all,
      _ => LoopMode.off,
    });
    _publishPlaybackState(_player.playbackEvent);
  }

  @override
  Future<void> setShuffleMode(AudioServiceShuffleMode shuffleMode) async {
    await _player.setShuffleModeEnabled(shuffleMode != AudioServiceShuffleMode.none);
    _publishPlaybackState(_player.playbackEvent);
  }

  void _publishPlaybackState(PlaybackEvent event) {
    final controls = <MediaControl>[
      MediaControl.skipToPrevious,
      if (_player.playing) MediaControl.pause else MediaControl.play,
      MediaControl.skipToNext,
      MediaControl.stop,
    ];

    playbackState.add(
      PlaybackState(
        controls: controls,
        androidCompactActionIndices: const [0, 1, 2],
        systemActions: const {MediaAction.seek},
        processingState: switch (_player.processingState) {
          ProcessingState.idle => AudioProcessingState.idle,
          ProcessingState.loading => AudioProcessingState.loading,
          ProcessingState.buffering => AudioProcessingState.buffering,
          ProcessingState.ready => AudioProcessingState.ready,
          ProcessingState.completed => AudioProcessingState.completed,
        },
        playing: _player.playing,
        updatePosition: event.updatePosition,
        bufferedPosition: event.bufferedPosition,
        speed: event.speed,
        queueIndex: event.currentIndex,
        repeatMode: switch (_player.loopMode) {
          LoopMode.one => AudioServiceRepeatMode.one,
          LoopMode.all => AudioServiceRepeatMode.all,
          _ => AudioServiceRepeatMode.none,
        },
        shuffleMode: _player.shuffleModeEnabled
            ? AudioServiceShuffleMode.all
            : AudioServiceShuffleMode.none,
      ),
    );
  }
}
