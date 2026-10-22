export const loadChatView = () => import('../components/overlays/ChatOverlay');

export function warmChatView() {
  void loadChatView().catch((error) => console.warn('Unable to preload chat', error));
}
