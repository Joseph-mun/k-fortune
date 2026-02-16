"use client";

import { useEffect, useRef } from "react";
import { Link2, Twitter, MessageCircle, Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareMenuProps {
  url: string;
  text: string;
  title?: string;
  onClose: () => void;
  isOpen: boolean;
}

export function ShareMenu({ url, text, title, onClose, isOpen }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch {
      // Clipboard access denied
    }
  };

  const handleTwitterShare = () => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  };

  const handleKakaoShare = () => {
    const encodedUrl = encodeURIComponent(url);
    window.open(
      `https://story.kakao.com/share?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: title || text, text, url });
      onClose();
    } catch {
      // User cancelled share dialog
    }
  };

  const supportsNativeShare = typeof navigator !== "undefined" && navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div
        ref={menuRef}
        className="bg-white border border-[#E8DFD3] rounded-xl shadow-lg w-full max-w-xs mx-4 overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E8DFD3]">
          <h3 className="text-sm font-semibold text-gray-900">Share</h3>
        </div>

        {/* Options */}
        <div className="py-2">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Link2 className="w-5 h-5 text-gray-700" />
            )}
            <span className="text-sm text-gray-900">
              {copied ? "Link copied!" : "Copy Link"}
            </span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <Twitter className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">Share to X</span>
          </button>

          {/* KakaoTalk */}
          <button
            onClick={handleKakaoShare}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">Share to KakaoTalk</span>
          </button>

          {/* Native Share */}
          {supportsNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-900">More options</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
