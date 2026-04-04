Refactor the "VitaNomy Account & Settings" page to strictly adhere to the established Neobrutalist design system using Tailwind CSS. 

GLOBAL REWRITE RULES (MANDATORY):
1. NO FAKE BROWSER: Delete the `.pw` and `.bc` wrapper. Make the layout `min-h-screen w-full`.
2. NO SVGs FACES: Remove the cartoon avatar in the header. Replace it with a Brutalist Avatar: a heavy square (`w-20 h-20`), pure White or Yellow background, `border-[3px] border-black`, hard black shadow, containing the user's initials in a massive, black sans-serif font.
3. NO GRADIENTS OR GLOWS: Remove all `radial-gradient` or soft glowing effects from the hero header and charts.
4. NO PASTELS: Remove all purple colors from the gender selector and tags. Use only Beige (#F8F5EE), Dark Green (#113826), White, Black, and Electric Yellow/Gold.
5. TYPOGRAPHY: Force all headings, tabs, and numbers to a heavy sans-serif font (Space Grotesk or Inter Black). Remove 'DM Serif Display'.

COMPONENT STYLING:
- Forms & Inputs: All `<input>`, `<select>`, and `<textarea>` elements MUST have `border-[3px] border-black`, a pure white background, sharp or slightly rounded corners (`rounded-md`), and a hard `shadow-[4px_4px_0px_#000000]`. Remove standard blue focus rings.
- Buttons & Tabs: Must be chunky with thick borders. Active tabs should have a solid background color (e.g., Electric Yellow) and a hard black shadow, not just an underline.
- Toggles: Replace soft, rounded iOS-style toggle switches with harsh, square or blocky Neobrutalist checkboxes or segmented buttons.
- Metrics Cards: Remove the tiny HTML sparkline bars from the individual health cards. Make the primary values (e.g., "118", "138/88") massive (`text-4xl` or `text-5xl font-black`). 
- Trend Chart: Remove the soft `rgba` area fill under the SVG line chart. Make the trend line a thick, solid black or Dark Green path.
- Plan Card: Keep the Dark Green background, but ensure all text and borders inside it are stark White or Yellow for maximum contrast. Apply `border-[3px] border-black` and a massive shadow.