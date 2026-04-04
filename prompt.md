Refactor the "VitaNomy AI Health Chat" interface to strictly adhere to a highly clinical, Neobrutalist design system using Tailwind CSS.

GLOBAL CONSTRAINTS:
- Remove the fake browser wrapper entirely. The app must be a full-bleed `h-screen w-screen` 3-column layout.
- Typography: Force all text, especially chat bubbles and headings, to a heavy, geometric sans-serif (e.g., Space Grotesk or Inter). No serif fonts.
- Shadows: ALL shadows must be solid `#000000` with 0px blur (e.g., `shadow-[4px_4px_0px_#000000]`).
- Borders: All chat bubbles, input fields, cards, and buttons MUST have `border-[3px] border-black`.
- Color Palette: STRICTLY Beige (#F8F5EE), White, Dark Green (#113826), and Black. REMOVE ALL PURPLE (#7B4FA0). Do not use color to differentiate gender modes; use stark typography badges instead.

LEFT & RIGHT SIDEBARS:
- Replace all human-face SVGs with brutalist typographic avatars (e.g., a stark square with a bold initial) or abstract geometric wireframes.
- The "Twin Mini" preview in the right sidebar must not use soft glowing pulses. Use hard-cut, instant blink animations (opacity 1 to 0) for active indicators.
- Make all data tags and history items heavy, solid blocks with thick borders.

CHAT CENTRE (The Core Fix):
- Chat Bubbles: Remove the soft `12px` rounding. Make them blocky (`rounded-md` maximum) with thick black borders and massive, hard black drop shadows. 
- AI Bubbles: White background, black text. 
- User Bubbles: Dark Green (#113826) background, white text.
- Context Snippets (Inside AI Messages): These must pop. Render them as internal stark white or electric yellow blocks with `border-[2px] border-black` inside the AI chat bubble.
- Input Area: Transform the input field into a heavy, industrial command line. Pure white background, thick black border. Make the Send button a massive, aggressive block (use a bold accent color like Electric Yellow) with a hard black shadow.