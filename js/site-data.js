/**
 * Personal Portfolio Configuration
 * 
 * Separation of Concerns:
 * Pure data layer containing all portfolio works, images, and links
 * matching the mobile-friendly editorial aesthetic of fabiomonzani.com.
 */

const SITE_CONFIG = {
  profile: {
    name: "David Chew",
    role: "Sound Designer & Audio Engineer",
    tagline: "Sound designer and audio engineer based in Singapore. Experienced in recording live acoustic ensembles, designing sound for games and theatre, and producing narrative podcasts.",
    location: "Singapore",
    avatar: "assets/img/profile-david.jpg",
    email: "hello@dcht.me",
    linkedin: "https://www.linkedin.com/in/davidcht/"
  },

  // Navigation Links
  navigation: [
    { label: "Podcasts", href: "#podcasts" },
    { label: "Musicals", href: "#musicals" },
    { label: "Recordings", href: "#recordings" },
    { label: "Games", href: "#games" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],

  // Interactive Games (Featured VR Game Showcase)
  // Games (Spotify shelf style — same layout as Recordings)
  games: [
    {
      id: "game-technodancer",
      title: "Technodancer",
      studio: "NUS School of Computing",
      year: "2019",
      role: "Sound Designer · Composer",
      coverImage: "assets/img/games/technodancer.jpg",
      badge: "VR Game Audio",
      accentColor: "#6366f1",
      videoUrl: "https://www.youtube.com/embed/BYr41RNu844",
      externalUrl: "https://www.facebook.com/CubeWorksUnlimited/"
    }
  ],

  // Dedicated Acoustic Ensembles & Chamber Recordings (Spotify Shelf style)
  acousticRecordings: [
    {
      id: "rec-erhu-cello",
      title: "Erhu and Cello Quartet",
      ensemble: "YSTCM Studio",
      year: "2019",
      role: "Recording & Mix Engineer",
      coverImage: "assets/img/recordings/erhu-cello-quartet.jpg",
      badge: "Chamber Music",
      accentColor: "#06b6d4",
      soundcloudTrackId: "906038341",
      soundcloudSecret: "s-AJOgFkgngod",
      externalUrl: "https://soundcloud.com/ddxdc/erhu-and-cello-quartet/s-AJOgFkgngod"
    },
    {
      id: "rec-jazz-ensemble",
      title: "NUS Jazz",
      ensemble: "NUS Jazz Band",
      year: "2020",
      role: "Recording & Mix Engineer",
      coverImage: "assets/img/recordings/nus-jazz.svg",
      badge: "Jazz Ensemble",
      accentColor: "#f59e0b",
      soundcloudTrackId: "907823914",
      soundcloudSecret: "s-Ui2RfczWUVo",
      externalUrl: "https://soundcloud.com/ddxdc/the-way-you-look-tonight-mix/s-Ui2RfczWUVo"
    },
    {
      id: "rec-beethoven-coriolan",
      title: "Beethoven Coriolan Overture Op. 62",
      ensemble: "Chamber Orchestra",
      year: "2019",
      role: "Recording & Mix Engineer",
      coverImage: "assets/img/recordings/beethoven-coriolan.jpg",
      badge: "Orchestral Recording",
      accentColor: "#ef4444",
      videoUrl: "https://www.youtube.com/embed/W17Aq3Kmp7I",
      externalUrl: "https://youtu.be/W17Aq3Kmp7I"
    },
    {
      id: "rec-piano-voice",
      title: "Voice and Piano",
      ensemble: "Barber: Hermit Songs Op. 29",
      year: "2019",
      role: "Recording & Mix Engineer",
      coverImage: "assets/img/recordings/barber-hermit-songs.jpg",
      badge: "Chamber Music",
      accentColor: "#ec4899",
      videoUrl: "https://www.youtube.com/embed/fYXXMYsn3Cg",
      externalUrl: "https://youtu.be/fYXXMYsn3Cg"
    },
    {
      id: "rec-flute-piano",
      title: "Flute and Piano",
      ensemble: "Mozart: Flute Concerto in G Major, K. 313",
      year: "2019",
      role: "Recording & Mix Engineer",
      coverImage: "assets/img/recordings/mozart-flute-piano.jpg",
      badge: "Chamber Music",
      accentColor: "#3b82f6",
      videoUrl: "https://www.youtube.com/embed/iQw4WUgAy48",
      externalUrl: "https://youtu.be/iQw4WUgAy48"
    }
  ],

  // Dedicated Musical Productions (Spotify Album/Playlist Shelf style)
  musicalProductions: [
    {
      id: "musical-perfectlife",
      title: "A Perfect Life",
      company: "Raffles Hall Musical Productions",
      year: "2019",
      role: "Sound Designer · Mix Engineer · Recording Engineer",
      coverImage: "assets/img/musicals/perfect-life-album.jpg",
      badge: "Musical Production",
      accentColor: "#f43f5e",
      soundcloudTrackId: "906058306",
      soundcloudSecret: "s-TG5dtNJrr8F",
      externalUrl: "https://soundcloud.com/ddxdc/a-perfect-life-2019-song-10/s-TG5dtNJrr8F"
    },
    {
      id: "musical-lukisan",
      title: "Lukisan Jati",
      company: "NUANSA Cultural Productions",
      year: "2019",
      role: "Sound Designer · Mix Engineer",
      coverImage: "assets/img/musicals/lukisan-jati.png",
      badge: "Musical Production",
      accentColor: "#eab308",
      externalUrl: "https://www.instagram.com/nuansacp/"
    },
    {
      id: "musical-tasteofhome",
      title: "A Taste of Home",
      company: "Raffles Hall Musical Productions",
      year: "2018",
      role: "Sound Designer · Mix Engineer · Recording Engineer",
      coverImage: "assets/img/musicals/taste-of-home.png",
      badge: "Musical Production",
      accentColor: "#3b82f6",
      externalUrl: "https://cfa.nus.edu.sg/whats-on/a-taste-of-home/"
    },
    {
      id: "musical-someday",
      title: "Someday",
      company: "Raffles Hall Musical Productions",
      year: "2017-18",
      role: "Sound Designer · Mix Engineer · Recording Engineer",
      coverImage: "assets/img/musicals/someday.jpg",
      badge: "Musical Production",
      accentColor: "#a855f7",
      soundcloudTrackId: "901371910",
      soundcloudSecret: "s-8iGShBVOb7j",
      externalUrl: "https://soundcloud.com/ddxdc/my-son/s-8iGShBVOb7j"
    }
  ],

  // Dedicated Podcast Productions (Spotify Album/Playlist Shelf style)
  podcastEpisodes: [
    {
      id: "podcast-homeonthedot",
      title: "Relocating Home",
      show: "Home on the Dot",
      year: "2020",
      role: "Sound Designer · Audio Engineer · Arranger",
      coverImage: "assets/img/podcasts/home-on-the-dot.jpg",
      badge: "Society & Culture",
      accentColor: "#10b981",
      spotifyUri: "spotify:episode:6dg5bkKWgZ6InAym2lKAqq",
      externalUrl: "https://open.spotify.com/episode/6dg5bkKWgZ6InAym2lKAqq"
    },
    {
      id: "podcast-thelogbook",
      title: "Ep 1 Insects",
      show: "The Log Book",
      year: "2020",
      role: "Sound Designer · Co-producer · Audio Engineer · Composer",
      coverImage: "assets/img/podcasts/the-log-book.jpg",
      badge: "Nature & Science",
      accentColor: "#14b8a6",
      spotifyUri: "spotify:episode:5uely5M5HBuYwRHs64u5nr",
      externalUrl: "https://open.spotify.com/episode/5uely5M5HBuYwRHs64u5nr"
    },
    {
      id: "podcast-afterdark",
      title: "[1.07] Anytime Soon",
      show: "After Dark",
      year: "2021",
      role: "Sound Designer · Producer · Audio Engineer",
      coverImage: "assets/img/podcasts/after-dark.jpg",
      badge: "Audio Drama",
      accentColor: "#8b5cf6",
      spotifyUri: "spotify:episode:3ocSSI6y7sjBqdwh0fhugq",
      externalUrl: "https://open.spotify.com/episode/3ocSSI6y7sjBqdwh0fhugq"
    },
    {
      id: "podcast-financialfitness",
      title: "Health Is Wealth, with Beatrice, Liu",
      show: "The Building Financial Fitness Podcast",
      year: "2021",
      role: "Audio Engineer · Dialogue Editor",
      coverImage: "assets/img/podcasts/financial-fitness.jpg",
      badge: "Business & Finance",
      accentColor: "#f59e0b",
      spotifyUri: "spotify:episode:1Zol5tPxBSqMzC4ILpL62v",
      externalUrl: "https://open.spotify.com/episode/1Zol5tPxBSqMzC4ILpL62v"
    },
    {
      id: "podcast-chengyufun",
      title: "五颜六色",
      show: "成语最加芬",
      year: "2021",
      role: "Sound Designer · Audio Engineer",
      coverImage: "assets/img/podcasts/chengyu-fun-peifen.jpg",
      badge: "Education",
      accentColor: "#f59e0b",
      soundcloudTrackId: "2423706705",
      soundcloudSecret: "s-lR90aFbbJxQ",
      externalUrl: "https://soundcloud.com/ddxdc/1-v1f-add-in-line/s-lR90aFbbJxQ"
    },
    {
      id: "podcast-shicheng2",
      title: "1986年 麦当劳学童失踪案",
      show: "狮城奇案",
      year: "2021",
      role: "Recording & Audio Engineer",
      coverImage: "assets/img/podcasts/shicheng-case-files-2.jpg",
      badge: "True Crime",
      accentColor: "#ef4444",
      spotifyUri: "spotify:episode:3zm5XjKLPTXmcUq4iejz44",
      externalUrl: "https://open.spotify.com/episode/3zm5XjKLPTXmcUq4iejz44"
    },
    {
      id: "podcast-poplore",
      title: "The future of Singapore pop",
      show: "PopLore: Stories of Singapore Pop",
      year: "2022",
      role: "Audio Engineer",
      coverImage: "assets/img/podcasts/future-singapore-pop.jpg",
      badge: "Society & Culture",
      accentColor: "#eab308",
      spotifyUri: "spotify:episode:5XS2rfr1OrvcZmt2hy2TTn",
      externalUrl: "https://open.spotify.com/episode/5XS2rfr1OrvcZmt2hy2TTn"
    },
    {
      id: "podcast-mrgs-darwin",
      title: "达尔文与进化论",
      show: "名人故事",
      year: "2023",
      role: "Sound Designer · Audio Engineer",
      coverImage: "assets/img/podcasts/mrgs-darwin-evolution.jpg",
      badge: "Society & Culture",
      accentColor: "#f97316",
      soundcloudTrackId: "2423708163",
      soundcloudSecret: "s-CXekKqhV9YD",
      externalUrl: "https://soundcloud.com/ddxdc/mrgs-s3-ep-3-darwin-evolution/s-CXekKqhV9YD"
    },
    {
      id: "podcast-notthevibes",
      title: "My Family Friend Has Access To Our CCTV",
      show: "Not The Vibes",
      year: "2024",
      role: "Audio Engineer",
      coverImage: "assets/img/podcasts/my-family-friend-cctv.jpg",
      badge: "Youth & Culture",
      accentColor: "#10b981",
      spotifyUri: "spotify:episode:7IPwO6qlV2qDIHFxOfUk9H",
      externalUrl: "https://open.spotify.com/episode/7IPwO6qlV2qDIHFxOfUk9H"
    },
    {
      id: "podcast-tingjian-nideai",
      title: "第1集",
      show: "听见你的爱",
      year: "2025",
      role: "Sound Designer · Recording & Audio Engineer",
      coverImage: "assets/img/podcasts/tingjian-nideai.jpg",
      badge: "Audio Drama",
      accentColor: "#e11d48",
      spotifyUri: "spotify:episode:3Ax3eLwc6wq8YLgFe3IXZV",
      externalUrl: "https://open.spotify.com/episode/3Ax3eLwc6wq8YLgFe3IXZV"
    }
  ],

  about: {
    bio: [
      "I'm a sound designer and audio engineer based in Singapore, trained in Audio Arts at the Yong Siew Toh Conservatory of Music (YSTCM).",
      "My work centers on capturing live acoustic performances, tracking musical productions, and crafting sound and dialogue for narrative podcasts and games.",
      "Whether working in the studio or out on location, I focus on capturing clean, natural sound that serves the project."
    ]
  }
};
