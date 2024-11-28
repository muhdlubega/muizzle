import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/ShareStats.css'

interface ShareStatsProps {
  gameStatus: string;
  guessesLeft: number;
  currentStreak: number;
  maxStreak: number;
  winRate: number;
}

const SITE_URL = window.location.origin;
const LOGO_URL = `${SITE_URL}/muizzle-logo.png`;

const ShareStats: React.FC<ShareStatsProps> = ({
  gameStatus,
  guessesLeft,
  currentStreak,
  maxStreak,
  winRate,
}) => {

    const generateShareText = () => {
        const gameResult = gameStatus === "won"
          ? `I won in ${6 - guessesLeft + 1} ${6 - guessesLeft + 1 === 1 ? 'guess' : 'guesses'}!`
          : "I didn't get it this time!";
    
        return `Check out my streak for this Wordle Tamil Movie Guesser! \n${gameResult}\nCurrent Streak: ${currentStreak}\nMax Streak: ${maxStreak}\nWin Rate: ${winRate}%\n\nPlay now at: ${SITE_URL}`;
      };

  const handleShareError = (platform: string, error: Error) => {
    toast.error(`Error: ${error} and unable to open ${platform}. Please try copying the stats instead.`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      toastId: `share-error-${platform}`,
    });
  };

  const shareToFacebook = () => {
    try {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(generateShareText())}&picture=${encodeURIComponent(LOGO_URL)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      handleShareError('Facebook', error as Error);
    }
  };

  const shareToTwitter = () => {
    try {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}&url=${encodeURIComponent(SITE_URL)}&cards=summary_large_image`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      handleShareError('Twitter', error as Error);
    }
  };

  const shareToWhatsApp = () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const text = generateShareText();
      const shareUrl = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(text)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank');
    } catch (error) {
      handleShareError('WhatsApp', error as Error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success('Stats copied to clipboard!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error ${error}. Failed to copy stats to clipboard`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="share-section">
      <h3>Share your stats</h3>
      <div className="share-buttons">
        <button
          className="share-button facebook"
          onClick={shareToFacebook}
          aria-label="Share to Facebook"
          title="Share to Facebook"
        >
          <FaFacebook size={24} />
        </button>
        <button
          className="share-button twitter"
          onClick={shareToTwitter}
          aria-label="Share to X (Twitter)"
          title="Share to X (Twitter)"
        >
          <FaTwitter size={24} />
        </button>
        <button
          className="share-button whatsapp"
          onClick={shareToWhatsApp}
          aria-label="Share to WhatsApp"
          title="Share to WhatsApp"
        >
          <FaWhatsapp size={24} />
        </button>
        <button
          className="share-button copy"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
          title="Copy to clipboard"
        >
          <FaCopy size={24} />
        </button>
      </div>
    </div>
  );
};

export default ShareStats;
