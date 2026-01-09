// Link data type definition
export interface Link {
  id: number;
  label: string;
  url: string;
  icon: string;
}

// Mock links data
export const links: Link[] = [
  {
    id: 8,
    label: "QQ",
    url: "https://qm.qq.com/q/KvoTP4H3yO",
    icon: "qq",
  },
  {
    id: 1,
    label: "GitHub",
    url: "https://github.com/MySxan",
    icon: "github",
  },
  {
    id: 2,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/mysxan/",
    icon: "linkedin",
  },
  {
    id: 3,
    label: "X",
    url: "https://x.com/rts_ms",
    icon: "twitter",
  },
  {
    id: 4,
    label: "Pixiv",
    url: "https://www.pixiv.net/users/53849788",
    icon: "pixiv",
  },
  {
    id: 5,
    label: "Bilibili",
    url: "https://space.bilibili.com/455404393",
    icon: "bilibili",
  },
  {
    id: 6,
    label: "Bandcamp",
    url: "https://mysxan.bandcamp.com/",
    icon: "bandcamp",
  },
  {
    id: 7,
    label: "Spotify",
    url: "https://open.spotify.com/artist/0kLse57Pg4W5UN5SeGeZxB",
    icon: "spotify",
  },
  {
    id: 9,
    label: "NetEase Music",
    url: "https://music.163.com/#/artist?id=51616966",
    icon: "netease",
  },
];
