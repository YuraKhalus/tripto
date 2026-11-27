import { BadgesSection } from './sections/BadgesSection/BadgesSection.jsx';
import { AvatarSection } from './sections/AvatarSection/AvatarSection.jsx';
import { CloseButtonSection } from './sections/CloseButtonSection/CloseButtonSection.jsx';

export function UiPage() {
  return (
    <div>
      <h1>UI-компоненти</h1>
      <BadgesSection />
      <AvatarSection />
      <CloseButtonSection />
    </div>
  );
}
