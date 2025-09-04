// Simple notification sound (ting ting)
import notificationSoundUrl from "./ding-36029.mp3";

export function playNotificationSound() {
  const audio = new window.Audio(notificationSoundUrl);
  audio.play();
}
