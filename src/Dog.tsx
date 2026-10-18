export type Coat = "cinnamon" | "chocolate" | "midnight";

export const coats: {
  id: Coat;
  name: string;
  body: string;
  dark: string;
  tan: string;
}[] = [
  {
    id: "cinnamon",
    name: "Cinnamon",
    body: "#ad512e",
    dark: "#773521",
    tan: "#e6a065",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    body: "#713e2d",
    dark: "#49281e",
    tan: "#c68b54",
  },
  {
    id: "midnight",
    name: "Midnight",
    body: "#343235",
    dark: "#242126",
    tan: "#b87944",
  },
];

export function Dog({
  coat = "cinnamon",
  pose = "stand",
  className = "",
}: {
  coat?: Coat;
  pose?: "stand" | "sleep" | "play";
  className?: string;
}) {
  const c = coats.find((item) => item.id === coat)!;
  if (pose === "sleep")
    return (
      <svg className={className} viewBox="0 0 600 350" aria-hidden="true">
        <path d="M112 251Q65 225 83 188q7-10 13 7l16 32" fill={c.dark} />
        <path
          d="M100 239c-13-77 29-115 111-105l177 6c62 2 93 49 81 105z"
          fill={c.body}
        />
        <path
          d="M360 208c-3-64 27-81 69-72l54 24 47 12q23 5 17 27c-4 18-30 24-53 24l-72 29-67-4z"
          fill={c.body}
        />
        <path
          d="M406 151q-44-13-47 34l9 60q5 30 29 23c22-7 17-61 9-117"
          fill={c.dark}
        />
        <path
          d="M470 191q11 10 22-1"
          fill="none"
          stroke="#421f1b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M536 174q21-1 16 13c-3 8-12 7-19 4z" fill="#421f1b" />
        <path
          d="M170 241h74m69 0h30"
          stroke={c.tan}
          strokeWidth="19"
          strokeLinecap="round"
        />
        <path
          d="M440 119q-4-14 8-19m8-12q12-3 7-15"
          stroke="#713425"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg className={className} viewBox="0 0 680 460" aria-hidden="true">
      <g transform={pose === "play" ? "rotate(-7 340 260)" : undefined}>
        <path
          d="M564 279c35-10 65-43 54-90-2-8-8-9-9 2-2 29-29 45-57 41z"
          fill={c.body}
        />
        <path
          d="M199 269l12 109q1 15 18 15h17q11-2 6-14l-13-15 7-99m268 8-7 102q-1 17 16 17h22q13-2 6-14l-14-14 21-94"
          fill={c.dark}
        />
        <path
          d="M160 239c49-37 128-21 216-15l144-1c54 0 76 25 68 76-4 25-25 41-59 44l-255-8c-70 1-116-28-114-96"
          fill={c.body}
        />
        <path
          d="M233 304l-4 79q0 15 17 15h28q12-3 4-14l-16-10 13-67m265-1-9 78q0 14 17 14h26q11-3 4-14l-14-10 15-67"
          fill={c.body}
        />
        <path
          d="M239 381h26m277 0h24"
          stroke={c.tan}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M129 131c-8-34 8-65 43-67 31-2 52 16 61 47l31 115c13 40 4 82-32 92-55 13-75-25-78-71l-5-58-45-3c-32-2-54-18-50-36 3-17 28-20 75-19"
          fill={c.body}
        />
        <path d="M70 136q-27-1-25 13c2 11 11 17 23 17l9-10z" fill="#421f1b" />
        <path
          d="M75 169q22 12 44 5"
          stroke={c.dark}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M149 99c-12 24-20 60-10 96 8 29 39 35 53 11 13-23 10-55-1-87-7-20-28-28-42-20"
          fill={c.dark}
        />
        <ellipse cx="120" cy="123" rx="7" ry="8" fill="#421f1b" />
        <circle cx="122" cy="120" r="2" fill="#fff8e8" />
        <path
          d="M99 113q10-10 19-6"
          fill="none"
          stroke={c.tan}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M162 230q30 10 75-14l8 23q-41 27-79 15z" fill="#f6e884" />
        <path d="M198 250l25 46 18-46" fill="#f6e884" />
        <path
          d="M218 263l8 11"
          stroke="#ad512e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M285 258q59 10 104 5"
          stroke={c.tan}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity=".6"
        />
      </g>
    </svg>
  );
}
