import React from 'react';
interface ChatOverlayProps {
    onClose: () => void;
    isVisible: boolean;
}
declare const ChatOverlay: React.FC<ChatOverlayProps>;
export default ChatOverlay;
