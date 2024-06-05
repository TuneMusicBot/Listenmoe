export default class Constants {
  // Audio URLs
  static readonly JPOP_VORBIS_AUDIO_URL = "https://listen.moe/stream";
  static readonly KPOP_VORBIS_AUDIO_URL = "https://listen.moe/kpop/stream";

  static readonly JPOP_OPUS_AUDIO_URL = "https://listen.moe/opus";
  static readonly KPOP_OPUS_AUDIO_URL = "https://listen.moe/kpop/opus";

  static readonly JPOP_MP3_AUDIO_URL = "https://listen.moe/fallback";
  static readonly KPOP_MP3_AUDIO_URL = "https://listen.moe/kpop/fallback";

  static readonly JPOP_M3U_AUDIO_URL = "https://listen.moe/m3u8/jpop.m3u";
  static readonly KPOP_M3U_AUDIO_URL = "https://listen.moe/m3u8/kpop.m3u";

  // Gateway URLs
  static readonly JPOP_GATEWAY_URL = "wss://listen.moe/gateway_v2";
  static readonly KPOP_GATEWAY_URL = "wss://listen.moe/kpop/gateway_v2";

  // CDN URL
  static readonly CDN_URL = "https://cdn.listen.moe/covers";
}
