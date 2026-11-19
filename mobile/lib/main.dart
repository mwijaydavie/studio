import 'package:audio_service/audio_service.dart';
import 'package:audio_session/audio_session.dart';
import 'package:flutter/material.dart';

import 'audio/aura_audio_handler.dart';
import 'screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final audioHandler = await AudioService.init<AuraAudioHandler>(
    builder: AuraAudioHandler.new,
    config: const AudioServiceConfig(
      androidNotificationChannelId: 'com.auratune.app.audio',
      androidNotificationChannelName: 'AuraTune music playback',
      // Keep the media service foreground while paused so Android 12+ can
      // resume playback from headset/notification controls without a new FGS launch.
      androidNotificationOngoing: false,
      androidStopForegroundOnPause: false,
    ),
  );

  final session = await AudioSession.instance;
  await session.configure(const AudioSessionConfiguration.music());

  runApp(AuraTuneApp(audioHandler: audioHandler));
}

class AuraTuneApp extends StatelessWidget {
  const AuraTuneApp({super.key, required this.audioHandler});

  final AuraAudioHandler audioHandler;

  @override
  Widget build(BuildContext context) {
    const background = Color(0xFF0B0A10);
    const surface = Color(0xFF17141F);
    const accent = Color(0xFFB18AFF);

    return MaterialApp(
      title: 'AuraTune',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: background,
        colorScheme: const ColorScheme.dark(
          primary: accent,
          secondary: Color(0xFFDFCFFF),
          surface: surface,
          onSurface: Color(0xFFF6F3FB),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: background,
          foregroundColor: Colors.white,
          centerTitle: false,
          elevation: 0,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white.withOpacity(.045),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(.1)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(.1)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: accent),
          ),
        ),
      ),
      home: HomeScreen(audioHandler: audioHandler),
    );
  }
}
