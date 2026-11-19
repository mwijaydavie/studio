import 'dart:async';
import 'dart:ui' show FontFeature;

import 'package:audio_service/audio_service.dart';
import 'package:flutter/material.dart';

import '../audio/aura_audio_handler.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.audioHandler});

  final AuraAudioHandler audioHandler;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<MediaItem> _tracks = [];
  StreamSubscription<PlaybackState>? _playbackSubscription;
  String? _lastPlaybackError;

  @override
  void initState() {
    super.initState();
    _playbackSubscription = widget.audioHandler.playbackState.listen((state) {
      final message = state.errorMessage;
      if (state.processingState == AudioProcessingState.error &&
          message != null && message != _lastPlaybackError) {
        _lastPlaybackError = message;
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Playback failed: $message')),
          );
        }
      } else if (state.processingState == AudioProcessingState.ready) {
        _lastPlaybackError = null;
      }
    });
  }

  @override
  void dispose() {
    _playbackSubscription?.cancel();
    super.dispose();
  }

  Future<void> _addTrack() async {
    final item = await showDialog<MediaItem>(
      context: context,
      builder: (context) => const _AddTrackDialog(),
    );
    if (item == null || !mounted) return;

    final nextQueue = [..._tracks, item];
    try {
      await widget.audioHandler.playQueue(nextQueue, startIndex: nextQueue.length - 1);
      if (!mounted) return;
      setState(() => _tracks
        ..clear()
        ..addAll(nextQueue));
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not start this stream: $error')),
      );
    }
  }

  Future<void> _playTrack(int index) async {
    try {
      await widget.audioHandler.playQueue(_tracks, startIndex: index);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not play this stream: $error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 22,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('AuraTune', style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: -.6)),
            SizedBox(height: 2),
            Text('NATIVE MUSIC PLAYER', style: TextStyle(fontSize: 9, letterSpacing: 2, color: Colors.white54)),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Add a stream URL',
            onPressed: _addTrack,
            icon: const Icon(Icons.add_circle_outline_rounded),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 22),
                children: [
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: Colors.white.withOpacity(.08)),
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF281B3A), Color(0xFF17131F), Color(0xFF111018)],
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: colors.primary.withOpacity(.16),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(Icons.graphic_eq_rounded, color: colors.primary),
                            ),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Playback stays with you', style: TextStyle(fontWeight: FontWeight.w700)),
                                  SizedBox(height: 3),
                                  Text('Lock screen · notification · headset', style: TextStyle(fontSize: 11, color: Colors.white60)),
                                ],
                              ),
                            ),
                            const Icon(Icons.bluetooth_audio_rounded, size: 19, color: Colors.white54),
                          ],
                        ),
                        const SizedBox(height: 28),
                        const Text('Your music,\nwithout the webview.', style: TextStyle(fontSize: 32, height: 1.08, fontWeight: FontWeight.w700, letterSpacing: -1.3)),
                        const SizedBox(height: 12),
                        const Text(
                          'A native Flutter player with Android media-session controls and background playback.',
                          style: TextStyle(height: 1.5, color: Colors.white60, fontSize: 13),
                        ),
                        const SizedBox(height: 22),
                        FilledButton.icon(
                          onPressed: _addTrack,
                          icon: const Icon(Icons.add_rounded),
                          label: const Text('Add an audio stream'),
                          style: FilledButton.styleFrom(
                            minimumSize: const Size(0, 48),
                            padding: const EdgeInsets.symmetric(horizontal: 18),
                            shape: const StadiumBorder(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('UP NEXT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 2, color: Colors.white60)),
                      Text('${_tracks.length} ${_tracks.length == 1 ? 'TRACK' : 'TRACKS'}', style: const TextStyle(fontSize: 9, letterSpacing: 1.3, color: Colors.white38)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (_tracks.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(.025),
                        border: Border.all(color: Colors.white.withOpacity(.07)),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.queue_music_rounded, color: Colors.white38),
                          SizedBox(width: 12),
                          Expanded(child: Text('Add a direct HTTPS audio link to start your queue.', style: TextStyle(color: Colors.white60, fontSize: 12, height: 1.45))),
                        ],
                      ),
                    )
                  else
                    ..._tracks.asMap().entries.map((entry) => _TrackRow(
                      item: entry.value,
                      index: entry.key,
                      onTap: () => _playTrack(entry.key),
                    )),
                  const SizedBox(height: 110),
                ],
              ),
            ),
            _NowPlayingBar(audioHandler: widget.audioHandler),
          ],
        ),
      ),
    );
  }
}

class _TrackRow extends StatelessWidget {
  const _TrackRow({required this.item, required this.index, required this.onTap});

  final MediaItem item;
  final int index;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final artwork = item.artUri;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.white.withOpacity(.035),
        borderRadius: BorderRadius.circular(17),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(17),
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: artwork == null
                      ? Container(width: 46, height: 46, color: const Color(0xFF30243E), child: const Icon(Icons.music_note_rounded, color: Color(0xFFCCB0FF)))
                      : Image.network(artwork.toString(), width: 46, height: 46, fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(width: 46, height: 46, color: const Color(0xFF30243E), child: const Icon(Icons.music_note_rounded, color: Color(0xFFCCB0FF)))),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 3),
                      Text(item.artist ?? 'Unknown artist', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, color: Colors.white54)),
                    ],
                  ),
                ),
                Text('${index + 1}'.padLeft(2, '0'), style: const TextStyle(color: Colors.white38, fontSize: 10, fontFeatures: [FontFeature.tabularFigures()])),
                const SizedBox(width: 8),
                const Icon(Icons.play_circle_outline_rounded, size: 22, color: Color(0xFFB18AFF)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NowPlayingBar extends StatelessWidget {
  const _NowPlayingBar({required this.audioHandler});

  final AuraAudioHandler audioHandler;

  String _time(Duration duration) {
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<MediaItem?>(
      stream: audioHandler.mediaItem,
      initialData: audioHandler.mediaItem.value,
      builder: (context, itemSnapshot) {
        final item = itemSnapshot.data;
        if (item == null) return const SizedBox.shrink();

        return Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
          decoration: BoxDecoration(
            color: const Color(0xFF17141F),
            border: Border(top: BorderSide(color: Colors.white.withOpacity(.08))),
            boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 24, offset: Offset(0, -6))],
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    _Artwork(item: item),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 3),
                          Text(item.artist ?? 'Unknown artist', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Colors.white54)),
                        ],
                      ),
                    ),
                    StreamBuilder<PlaybackState>(
                      stream: audioHandler.playbackState,
                      initialData: audioHandler.playbackState.value,
                      builder: (context, playbackSnapshot) {
                        final playing = playbackSnapshot.data?.playing ?? false;
                        return IconButton.filled(
                          tooltip: playing ? 'Pause' : 'Play',
                          onPressed: () => playing ? audioHandler.pause() : audioHandler.play(),
                          icon: Icon(playing ? Icons.pause_rounded : Icons.play_arrow_rounded),
                        );
                      },
                    ),
                    IconButton(
                      tooltip: 'Next track',
                      onPressed: audioHandler.skipToNext,
                      icon: const Icon(Icons.skip_next_rounded),
                    ),
                  ],
                ),
                StreamBuilder<Duration>(
                  stream: audioHandler.positionStream,
                  initialData: Duration.zero,
                  builder: (context, positionSnapshot) {
                    final position = positionSnapshot.data ?? Duration.zero;
                    final duration = item.duration ?? Duration.zero;
                    final maxSeconds = duration.inSeconds > 0 ? duration.inSeconds.toDouble() : 1.0;
                    final value = position.inSeconds.clamp(0, maxSeconds.toInt()).toDouble();
                    return Row(
                      children: [
                        Text(_time(position), style: const TextStyle(fontSize: 9, color: Colors.white38, fontFeatures: [FontFeature.tabularFigures()])),
                        Expanded(
                          child: Slider(
                            min: 0,
                            max: maxSeconds,
                            value: value,
                            onChanged: duration == Duration.zero ? null : (seconds) => audioHandler.seek(Duration(seconds: seconds.round())),
                          ),
                        ),
                        Text(_time(duration), style: const TextStyle(fontSize: 9, color: Colors.white38, fontFeatures: [FontFeature.tabularFigures()])),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _Artwork extends StatelessWidget {
  const _Artwork({required this.item});
  final MediaItem item;

  @override
  Widget build(BuildContext context) {
    final url = item.artUri?.toString();
    if (url == null) {
      return Container(width: 42, height: 42, decoration: BoxDecoration(color: const Color(0xFF30243E), borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.music_note_rounded, color: Color(0xFFCCB0FF)));
    }
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.network(url, width: 42, height: 42, fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(width: 42, height: 42, color: const Color(0xFF30243E), child: const Icon(Icons.music_note_rounded, color: Color(0xFFCCB0FF)))),
    );
  }
}

class _AddTrackDialog extends StatefulWidget {
  const _AddTrackDialog();

  @override
  State<_AddTrackDialog> createState() => _AddTrackDialogState();
}

class _AddTrackDialogState extends State<_AddTrackDialog> {
  final _formKey = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _artist = TextEditingController();
  final _audioUrl = TextEditingController();
  final _artUrl = TextEditingController();

  @override
  void dispose() {
    _title.dispose();
    _artist.dispose();
    _audioUrl.dispose();
    _artUrl.dispose();
    super.dispose();
  }

  String? _httpsUrl(String? value, {required String label, bool optional = false}) {
    final text = value?.trim() ?? '';
    if (text.isEmpty && optional) return null;
    final uri = Uri.tryParse(text);
    if (uri == null || uri.scheme != 'https' || !uri.hasAuthority) {
      return '$label must be a valid HTTPS URL.';
    }
    return null;
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final art = _artUrl.text.trim();
    Navigator.of(context).pop(MediaItem(
      id: _audioUrl.text.trim(),
      title: _title.text.trim(),
      artist: _artist.text.trim().isEmpty ? 'Unknown artist' : _artist.text.trim(),
      artUri: art.isEmpty ? null : Uri.parse(art),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF17141F),
      title: const Text('Add an audio stream'),
      content: SizedBox(
        width: 420,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: EdgeInsets.only(bottom: 14),
                    child: Text('Use a direct HTTPS audio/stream URL—not a webpage or video link.', style: TextStyle(color: Colors.white60, fontSize: 12, height: 1.45)),
                  ),
                ),
                TextFormField(controller: _title, autofocus: true, textInputAction: TextInputAction.next, decoration: const InputDecoration(labelText: 'Track title'), validator: (value) => (value?.trim().isEmpty ?? true) ? 'Enter a title.' : null),
                const SizedBox(height: 12),
                TextFormField(controller: _artist, textInputAction: TextInputAction.next, decoration: const InputDecoration(labelText: 'Artist (optional)')),
                const SizedBox(height: 12),
                TextFormField(controller: _audioUrl, keyboardType: TextInputType.url, textInputAction: TextInputAction.next, decoration: const InputDecoration(labelText: 'HTTPS audio URL'), validator: (value) => _httpsUrl(value, label: 'Audio URL')),
                const SizedBox(height: 12),
                TextFormField(controller: _artUrl, keyboardType: TextInputType.url, textInputAction: TextInputAction.done, decoration: const InputDecoration(labelText: 'Cover art URL (optional)'), validator: (value) => _httpsUrl(value, label: 'Cover URL', optional: true), onFieldSubmitted: (_) => _submit()),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(onPressed: _submit, child: const Text('Play now')),
      ],
    );
  }
}
