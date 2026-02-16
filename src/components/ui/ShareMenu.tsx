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
        className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-lg w-full max-w-xs mx-4 overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Share</h3>
        </div>

        {/* Options */}
        <div className="py-2">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Link2 className="w-5 h-5 text-zinc-400" />
            )}
            <span className="text-sm text-white">
              {copied ? "Link copied!" : "Copy Link"}
            </span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
          >
            <Twitter className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-white">Share to X</span>
          </button>

          {/* KakaoTalk */}
          <button
            onClick={handleKakaoShare}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
          >
            <MessageCircle className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-white">Share to KakaoTalk</span>
          </button>

          {/* Native Share */}
          {supportsNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
            >
              <Share2 className="w-5 h-5 text-zinc-400" />
              <span className="text-sm text-white">More options</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
