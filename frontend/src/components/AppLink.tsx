import { FC, AnchorHTMLAttributes, MouseEvent } from 'react';

/**
 * A component that wraps anchor links to ensure they open appropriately in PWA context.
 * When the app is installed as a PWA, this prevents links from opening the browser.
 */
interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  // Any additional props specific to AppLink
  forceExternal?: boolean;
}

const AppLink: FC<AppLinkProps> = ({ 
  href, 
  children, 
  onClick, 
  target, 
  rel,
  forceExternal = false,
  ...rest 
}) => {
  const isExternalLink = href?.startsWith('http') || href?.startsWith('//') || forceExternal;
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // First call any existing onClick handler
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }
    
    // If it's not an external link, or if it's explicitly set to open in the same window,
    // or if we're not in a standalone PWA context, just let the default behavior happen
    if (!isExternalLink || target === '_self' || 
        !window.matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches) {
      return;
    }
    
    // For external links in standalone mode, we need special handling
    e.preventDefault();
    
    // Open in a new window instead of leaving the PWA
    window.open(href, '_blank', 'noopener,noreferrer');
  };
  
  // Set appropriate target and rel for external links
  const linkTarget = isExternalLink ? target || '_blank' : target;
  const linkRel = isExternalLink && linkTarget === '_blank' ? `${rel || ''} noopener noreferrer`.trim() : rel;
  
  return (
    <a 
      href={href}
      onClick={handleClick}
      target={linkTarget}
      rel={linkRel}
      {...rest}
    >
      {children}
    </a>
  );
};

export default AppLink;
