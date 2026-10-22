/**
 * Main Application Logic
 * 
 * Separation of Concerns:
 * - Reads content dynamically from SITE_CONFIG (js/site-data.js)
 * - Safe DOM injection avoiding XSS
 * - Renders project cards with real images, gradient fallbacks & audio preview players
 * - Dark / Light theme toggling with localStorage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  hydrateProfile();
  renderPodcasts();
  renderMusicals();
  renderRecordings();
  renderGames();
  renderAbout();

  // Attach interactive controllers after all cards are rendered
  attachInlineAudioControllers();
  attachYouTubeControllers();
  attachSpotifyAudioControllers();
});

/**
 * 1. Dark / Light Theme Toggle Management
 */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme-preference') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeButton(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme-preference', newTheme);
      updateThemeButton(newTheme);
    });
  }
}

function updateThemeButton(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'light' ? '🌙 Dark' : '☀️ Light';
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
  }
}

/**
 * 2. Populate Profile & Header Details
 */
function hydrateProfile() {
  if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.profile) return;
  const p = SITE_CONFIG.profile;

  // Brand Name & Page Title
  const brandEl = document.getElementById('brand-name');
  if (brandEl) brandEl.textContent = p.name;

  const pageTitleEl = document.getElementById('page-title');
  if (pageTitleEl) pageTitleEl.textContent = `${p.name} — ${p.role}`;

  // Hero Lead Tagline
  const heroTaglineEl = document.getElementById('hero-tagline');
  if (heroTaglineEl) heroTaglineEl.textContent = p.tagline;

  // Contact / Social Links
  const emailLinkEl = document.getElementById('contact-email-btn');
  if (emailLinkEl) {
    emailLinkEl.href = `mailto:${p.email}`;
    emailLinkEl.textContent = `Get in touch (${p.email})`;
  }

  const soundcloudLinkEl = document.getElementById('social-soundcloud');
  if (soundcloudLinkEl && p.soundcloud) soundcloudLinkEl.href = p.soundcloud;

  const githubLinkEl = document.getElementById('social-github');
  if (githubLinkEl && p.github) githubLinkEl.href = p.github;

  const linkedinLinkEl = document.getElementById('social-linkedin');
  if (linkedinLinkEl && p.linkedin) linkedinLinkEl.href = p.linkedin;

  const copyrightNameEl = document.getElementById('copyright-name');
  if (copyrightNameEl) copyrightNameEl.textContent = p.name;
}

/**
 * 3a. Render Games (Spotify shelf style — same layout as Recordings)
 */
function renderGames() {
  const container = document.getElementById('games-grid');
  if (!container || typeof SITE_CONFIG === 'undefined' || !Array.isArray(SITE_CONFIG.games)) return;

  container.innerHTML = '';

  SITE_CONFIG.games.forEach(item => {
    const card = document.createElement('article');
    card.className = 'spotify-card';
    card.id = escapeHTML(item.id);

    const hasVideo = Boolean(item.videoUrl);

    let actionHtml = '';
    if (hasVideo) {
      const ytMatch = item.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
      const ytId = ytMatch ? ytMatch[1] : '';
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button
            type="button"
            class="spotify-play-btn js-yt-play-btn"
            data-card-id="${escapeHTML(item.id)}"
            data-yt-id="${escapeHTML(ytId)}"
            aria-label="Play ${escapeHTML(item.title)} video inline">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (item.externalUrl) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <a href="${escapeHTML(item.externalUrl)}" target="_blank" rel="noopener noreferrer" class="spotify-play-btn" aria-label="View ${escapeHTML(item.title)}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-4 14H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-2h-2v2z"/>
            </svg>
          </a>
        </div>
      `;
    }

    const ytPlayerHtml = hasVideo ? `
      <div id="yt-player-${escapeHTML(item.id)}" class="yt-inline-player" style="display:none;" aria-hidden="true"></div>
    ` : '';

    card.innerHTML = `
      <div class="spotify-thumb-wrapper">
        <img src="${escapeHTML(item.coverImage)}" alt="${escapeHTML(item.title)} cover" class="spotify-cover-img" loading="lazy" />
        <span class="spotify-badge" style="--badge-accent: ${escapeHTML(item.accentColor || '#6366f1')}">${escapeHTML(item.badge || item.year)}</span>
        ${actionHtml}
        ${ytPlayerHtml}
      </div>
      <div class="spotify-card-meta">
        <h3 class="spotify-card-title">${escapeHTML(item.title)}</h3>
        <p class="spotify-card-company">${escapeHTML(item.studio)}</p>
        <p class="spotify-card-year">${escapeHTML(item.year)}</p>
        <p class="spotify-card-role">${escapeHTML(item.role)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 3b. Render Featured Works (legacy editorial layout — kept for reference)
 */
function renderWorks() {
  if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.featuredWorks) return;
  const container = document.getElementById('works-container');
  if (!container) return;

  container.innerHTML = '';

  SITE_CONFIG.featuredWorks.forEach((work) => {
    const card = document.createElement('article');
    card.className = 'work-item';
    card.id = work.id;

    // Tags rendering
    const tagsHtml = (work.tags || [])
      .map(tag => `<span class="pill-tag">${escapeHTML(tag)}</span>`)
      .join('');

    // Audio embed if spotify or soundcloud track id exists
    let audioEmbedHtml = '';
    if (work.spotifyEmbedUrl) {
      audioEmbedHtml = `
        <div class="work-audio-embed spotify-embed-frame">
          <iframe 
            src="${escapeHTML(work.spotifyEmbedUrl)}" 
            width="100%" 
            height="232" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"
            loading="lazy">
          </iframe>
        </div>
      `;
    } else if (work.soundcloudTrackId) {
      const secretParam = work.soundcloudSecret ? `%3Fsecret_token%3D${encodeURIComponent(work.soundcloudSecret)}` : '';
      audioEmbedHtml = `
        <div class="work-audio-embed">
          <iframe 
            width="100%" 
            height="140" 
            scrolling="no" 
            frameborder="no" 
            loading="lazy"
            allow="autoplay" 
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${work.soundcloudTrackId}${secretParam}&color=%236366f1&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false">
          </iframe>
        </div>
      `;
    }

    const externalBtnHtml = work.externalUrl ? `
      <div class="work-action">
        <a href="${escapeHTML(work.externalUrl)}" target="_blank" rel="noopener noreferrer" class="link-arrow">
          ${escapeHTML(work.externalLabel || 'Explore Project')} <span aria-hidden="true">↗</span>
        </a>
      </div>
    ` : '';

    // Image canvas, video canvas, or gradient fallback
    let imageCanvasHtml = '';
    if (work.videoEmbedUrl) {
      imageCanvasHtml = `
        <div class="work-canvas work-canvas-video">
          <iframe 
            src="${escapeHTML(work.videoEmbedUrl)}" 
            title="${escapeHTML(work.title)} Video Preview" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
          <span class="work-badge">${escapeHTML(work.previewBadge || work.category || 'VR Game Audio')}</span>
        </div>
      `;
    } else if (work.image) {
      imageCanvasHtml = `
        <div class="work-canvas has-image">
          <img src="${escapeHTML(work.image)}" alt="${escapeHTML(work.title)}" class="work-canvas-img" loading="lazy" />
          <span class="work-badge">${escapeHTML(work.previewBadge || work.category || 'Featured Work')}</span>
        </div>
      `;
    } else {
      imageCanvasHtml = `
        <div class="work-canvas" style="background: ${work.accentGradient};">
          <span class="work-badge">${escapeHTML(work.previewBadge || work.category || 'Featured Work')}</span>
        </div>
      `;
    }

    const subtitleHtml = work.subtitle ? `<p class="work-subtitle">${escapeHTML(work.subtitle)}</p>` : '';

    // Optional Gallery Thumbnails (e.g. for theatrical & musical productions)
    let galleryHtml = '';
    if (work.gallery && work.gallery.length > 0) {
      const thumbs = work.gallery.map((item, idx) => `
        <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" data-full-img="${escapeHTML(item.image)}" data-title="${escapeHTML(item.title)}" aria-label="View poster for ${escapeHTML(item.title)}">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy" />
          <span class="gallery-thumb-label">${escapeHTML(item.year || item.title)}</span>
        </button>
      `).join('');

      galleryHtml = `
        <div class="work-gallery-block">
          <div class="gallery-header">
            <span class="col-label">Production Archive Posters</span>
            <span class="gallery-hint">Click poster to preview</span>
          </div>
          <div class="gallery-thumbs-row">
            ${thumbs}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      ${imageCanvasHtml}
      
      <div class="work-details">
        <div class="work-header">
          <div>
            <h3 class="work-title">${escapeHTML(work.title)}</h3>
            ${subtitleHtml}
          </div>
          <span class="role-tag">${escapeHTML(work.role)}</span>
        </div>

        <div class="work-grid-description">
          <div class="desc-col">
            <span class="col-label">The Project & Scope</span>
            <p>${escapeHTML(work.summary)}</p>
          </div>
          <div class="desc-col">
            <span class="col-label">Approach & Outcome</span>
            <p>${escapeHTML(work.impact)}</p>
          </div>
        </div>

        ${galleryHtml}

        ${audioEmbedHtml}

        <div class="work-footer-bar">
          <div class="work-tags">
            ${tagsHtml}
          </div>
          ${externalBtnHtml}
        </div>
      </div>
    `;

    // Attach interactive thumbnail click switcher to smoothly update canvas image
    if (work.gallery && work.gallery.length > 0) {
      const canvasImg = card.querySelector('.work-canvas-img');
      const thumbBtns = card.querySelectorAll('.gallery-thumb-btn');

      thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const newSrc = btn.getAttribute('data-full-img');
          if (canvasImg && newSrc) {
            canvasImg.style.opacity = '0';
            setTimeout(() => {
              canvasImg.src = newSrc;
              canvasImg.style.opacity = '1';
            }, 180);
          }
          thumbBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }

    container.appendChild(card);
  });
}

/**
 * 4. Render Musicals & Theatre Shelf (Spotify Playlist Shelf Style with Direct Audio Playback)
 */
let activeAudioWidget = null;
let activePlayingCardId = null;

function renderMusicals() {
  const container = document.getElementById('musicals-grid');
  if (!container || typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.musicalProductions) return;

  container.innerHTML = '';

  SITE_CONFIG.musicalProductions.forEach(item => {
    const card = document.createElement('article');
    card.className = 'spotify-card';
    card.id = item.id;

    // Has playable SoundCloud audio track
    const hasAudio = Boolean(item.soundcloudTrackId);

    // Play action button: interactive player toggle if track exists, else external project link
    let actionHtml = '';
    if (hasAudio) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button type="button" class="spotify-play-btn js-audio-play-btn" data-card-id="${escapeHTML(item.id)}" aria-label="Play ${escapeHTML(item.title)} directly">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (item.externalUrl) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <a href="${escapeHTML(item.externalUrl)}" target="_blank" rel="noopener noreferrer" class="spotify-play-btn" aria-label="View ${escapeHTML(item.title)}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-4 14H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-2h-2v2z"/>
            </svg>
          </a>
        </div>
      `;
    }

    // Hidden iframe embed for SoundCloud Widget playback
    const secretParam = item.soundcloudSecret ? `&secret_token=${encodeURIComponent(item.soundcloudSecret)}` : '';
    const hiddenPlayerHtml = hasAudio ? `
      <iframe 
        id="sc-player-${escapeHTML(item.id)}"
        class="hidden-audio-frame"
        width="100%" 
        height="100" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay" 
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundcloudTrackId}${secretParam}&auto_play=false">
      </iframe>
    ` : '';

    card.innerHTML = `
      <div class="spotify-thumb-wrapper">
        <img src="${escapeHTML(item.coverImage)}" alt="${escapeHTML(item.title)} poster" class="spotify-cover-img" loading="lazy" />
        <span class="spotify-badge" style="--badge-accent: ${escapeHTML(item.accentColor || '#6366f1')}">${escapeHTML(item.badge || item.year)}</span>
        ${actionHtml}
        ${hiddenPlayerHtml}
      </div>
      <div class="spotify-card-meta">
        <h3 class="spotify-card-title">${escapeHTML(item.title)}</h3>
        <p class="spotify-card-company">${escapeHTML(item.company)}</p>
        <p class="spotify-card-year">${escapeHTML(item.year)}</p>
        <p class="spotify-card-role">${escapeHTML(item.role)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 4b. Render Podcasts & Shows (Spotify Playlist Shelf style - same layout as Musicals)
 */
function renderPodcasts() {
  const container = document.getElementById('podcasts-grid');
  if (!container || typeof SITE_CONFIG === 'undefined' || !Array.isArray(SITE_CONFIG.podcastEpisodes)) return;

  container.innerHTML = '';

  SITE_CONFIG.podcastEpisodes.forEach(item => {
    const card = document.createElement('article');
    card.className = 'spotify-card';
    card.id = escapeHTML(item.id);

    const hasAudio = Boolean(item.soundcloudTrackId);
    const hasSpotify = Boolean(item.spotifyUri) && !hasAudio;
    let actionHtml = '';

    if (hasAudio) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button type="button" class="spotify-play-btn js-audio-play-btn" data-card-id="${escapeHTML(item.id)}" aria-label="Play ${escapeHTML(item.title)} directly">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (hasSpotify) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button 
            type="button" 
            class="spotify-play-btn js-spotify-play-btn" 
            data-card-id="${escapeHTML(item.id)}"
            data-spotify-uri="${escapeHTML(item.spotifyUri)}"
            data-external-url="${escapeHTML(item.externalUrl || '')}"
            aria-label="Play ${escapeHTML(item.title)} on Spotify">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (item.externalUrl) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <a href="${escapeHTML(item.externalUrl)}" target="_blank" rel="noopener noreferrer" class="spotify-play-btn" aria-label="Listen to ${escapeHTML(item.title)}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-4 14H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-2h-2v2z"/>
            </svg>
          </a>
        </div>
      `;
    }

    const secretParam = item.soundcloudSecret ? `&secret_token=${encodeURIComponent(item.soundcloudSecret)}` : '';
    const hiddenPlayerHtml = hasAudio ? `
      <iframe 
        id="sc-player-${escapeHTML(item.id)}"
        class="hidden-audio-frame"
        width="100%" 
        height="100" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay" 
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundcloudTrackId}${secretParam}&auto_play=false">
      </iframe>
    ` : '';

    // Inline Spotify embed player overlay container (opens over card artwork on play)
    const spotifyPlayerHtml = hasSpotify ? `
      <div id="spotify-player-${escapeHTML(item.id)}" class="spotify-inline-player" style="display:none;" aria-hidden="true"></div>
    ` : '';

    card.innerHTML = `
      <div class="spotify-thumb-wrapper">
        <img src="${escapeHTML(item.coverImage)}" alt="${escapeHTML(item.title)} cover" class="spotify-cover-img" loading="lazy" />
        <span class="spotify-badge" style="--badge-accent: ${escapeHTML(item.accentColor || '#10b981')}">${escapeHTML(item.badge || item.year)}</span>
        ${actionHtml}
        ${hiddenPlayerHtml}
        ${spotifyPlayerHtml}
      </div>
      <div class="spotify-card-meta">
        <h3 class="spotify-card-title">${escapeHTML(item.show || item.title)}</h3>
        <p class="spotify-card-year">${escapeHTML(item.year)}</p>
        <p class="spotify-card-role">${escapeHTML(item.role)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 4c. Render Acoustic Recordings & Ensembles (Spotify Playlist Shelf style - same layout)
 */
function renderRecordings() {
  const container = document.getElementById('recordings-grid');
  if (!container || typeof SITE_CONFIG === 'undefined' || !Array.isArray(SITE_CONFIG.acousticRecordings)) return;

  container.innerHTML = '';

  SITE_CONFIG.acousticRecordings.forEach(item => {
    const card = document.createElement('article');
    card.className = 'spotify-card';
    card.id = escapeHTML(item.id);

    const hasAudio = Boolean(item.soundcloudTrackId);
    const hasVideo = Boolean(item.videoUrl) && !hasAudio;
    let actionHtml = '';

    if (hasAudio) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button 
            type="button" 
            class="spotify-play-btn js-audio-play-btn" 
            data-card-id="${escapeHTML(item.id)}"
            aria-label="Play ${escapeHTML(item.title)} directly on page">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (hasVideo) {
      // Extract video ID from youtube URL
      const ytMatch = item.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
      const ytId = ytMatch ? ytMatch[1] : '';
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <button 
            type="button" 
            class="spotify-play-btn js-yt-play-btn" 
            data-card-id="${escapeHTML(item.id)}"
            data-yt-id="${escapeHTML(ytId)}"
            aria-label="Play ${escapeHTML(item.title)} video inline">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>
      `;
    } else if (item.externalUrl) {
      actionHtml = `
        <div class="spotify-play-btn-wrapper">
          <a href="${escapeHTML(item.externalUrl)}" target="_blank" rel="noopener noreferrer" class="spotify-play-btn" aria-label="Listen to ${escapeHTML(item.title)}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-4 14H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-2h-2v2z"/>
            </svg>
          </a>
        </div>
      `;
    }

    const secretParam = item.soundcloudSecret ? `&secret_token=${encodeURIComponent(item.soundcloudSecret)}` : '';
    const hiddenPlayerHtml = hasAudio ? `
      <iframe 
        id="sc-player-${escapeHTML(item.id)}"
        class="hidden-audio-frame"
        width="100%" 
        height="100" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay" 
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundcloudTrackId}${secretParam}&auto_play=false">
      </iframe>
    ` : '';

    // YouTube inline player overlay (hidden until play is clicked)
    const ytPlayerHtml = hasVideo ? `
      <div id="yt-player-${escapeHTML(item.id)}" class="yt-inline-player" style="display:none;" aria-hidden="true"></div>
    ` : '';

    const thumbContentHtml = item.coverImage ? `
      <img src="${escapeHTML(item.coverImage)}" alt="${escapeHTML(item.title)} cover" class="spotify-cover-img" loading="lazy" />
    ` : `
      <div class="spotify-cover-placeholder" style="--badge-accent: ${escapeHTML(item.accentColor || '#f59e0b')}">
        <svg class="spotify-placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
    `;

    card.innerHTML = `
      <div class="spotify-thumb-wrapper">
        ${thumbContentHtml}
        <span class="spotify-badge" style="--badge-accent: ${escapeHTML(item.accentColor || '#06b6d4')}">${escapeHTML(item.badge || item.year)}</span>
        ${actionHtml}
        ${hiddenPlayerHtml}
        ${ytPlayerHtml}
      </div>
      <div class="spotify-card-meta">
        <h3 class="spotify-card-title">${escapeHTML(item.title)}</h3>
        <p class="spotify-card-company">${escapeHTML(item.ensemble)}</p>
        <p class="spotify-card-year">${escapeHTML(item.year)}</p>
        <p class="spotify-card-role">${escapeHTML(item.role)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

let activeSpotifyCardId = null;
let spotifyEmbedController = null;
let spotifyApiReady = false;
let queuedSpotifyUri = null;

// Global callback for official Spotify IFrame API
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  spotifyApiReady = true;
  const embedContainer = document.getElementById('bottom-player-embed-container');
  if (!embedContainer) return;

  const element = document.createElement('div');
  element.id = 'spotify-api-embed-target';
  embedContainer.appendChild(element);

  const defaultUri = queuedSpotifyUri || 'spotify:episode:6dg5bkKWgZ6InAym2lKAqq';

  const options = {
    width: '100%',
    height: 80,
    uri: defaultUri
  };

  const callback = (EmbedController) => {
    spotifyEmbedController = EmbedController;

    // Optional: listen to playback status updates
    spotifyEmbedController.addListener('playback_update', e => {
      if (e && e.data) {
        const isPaused = e.data.isPaused;
        if (activeSpotifyCardId) {
          const activeCard = document.getElementById(activeSpotifyCardId);
          const activeBtn = activeCard ? activeCard.querySelector('.js-spotify-play-btn') : null;
          if (activeBtn) setButtonPlaying(activeBtn, activeCard, !isPaused);
        }
      }
    });

    // If an episode was clicked before the controller was ready, play it now
    if (queuedSpotifyUri) {
      spotifyEmbedController.loadUri(queuedSpotifyUri);
      try { spotifyEmbedController.play(); } catch (err) {}
      queuedSpotifyUri = null;
    }
  };

  IFrameAPI.createController(element, options, callback);
};

function stopActiveSpotify() {
  if (!activeSpotifyCardId) return;
  const prevCard = document.getElementById(activeSpotifyCardId);
  const prevBtn = prevCard ? prevCard.querySelector('.js-spotify-play-btn') : null;
  if (prevBtn) setButtonPlaying(prevBtn, prevCard, false);
  if (spotifyEmbedController) {
    try { spotifyEmbedController.pause(); } catch (err) {}
  }
  activeSpotifyCardId = null;
  hideBottomPlayer();
}

function showBottomPlayer(item, spotifyUri, episodeId) {
  const bar = document.getElementById('bottom-player-bar');
  const art = document.getElementById('bottom-player-art');
  const title = document.getElementById('bottom-player-title');
  const subtitle = document.getElementById('bottom-player-subtitle');
  const spotifyContainer = document.getElementById('bottom-player-embed-container');
  const scContainer = document.getElementById('bottom-player-sc-container');
  if (!bar) return;

  if (art) {
    art.src = item.coverImage || '';
    art.alt = item.title || 'Cover Artwork';
  }
  // For podcasts, display show name as headline and genre badge as subtitle
  if (item.show) {
    if (title) title.textContent = item.show;
    if (subtitle) subtitle.textContent = item.badge || 'Podcast';
  } else {
    if (title) title.textContent = item.title || '';
    const metaSubtitle = item.company || item.ensemble || '';
    if (subtitle) subtitle.textContent = (metaSubtitle ? `${metaSubtitle} · ` : '') + (item.badge || 'Audio');
  }

  // Switch to Spotify mode
  if (spotifyContainer) spotifyContainer.style.display = 'flex';
  if (scContainer) {
    scContainer.style.display = 'none';
    scContainer.innerHTML = '';
  }

  bar.classList.add('is-visible');
  bar.setAttribute('aria-hidden', 'false');

  if (spotifyEmbedController) {
    // Dynamically load clicked episode and command programmatic playback
    spotifyEmbedController.loadUri(spotifyUri);
    try {
      spotifyEmbedController.play();
    } catch (err) {
      console.warn('Spotify autoplay blocked or pending user interaction:', err);
    }
  } else {
    // API still initializing: queue URI and render fallback iframe
    queuedSpotifyUri = spotifyUri;
    if (spotifyContainer && !document.getElementById('spotify-api-embed-target')) {
      spotifyContainer.innerHTML = `<iframe
        src="https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="${escapeHTML(item.title)} Spotify Player"
      ></iframe>`;
    }
  }
}

function showBottomPlayerSoundCloud(item) {
  const bar = document.getElementById('bottom-player-bar');
  const art = document.getElementById('bottom-player-art');
  const title = document.getElementById('bottom-player-title');
  const subtitle = document.getElementById('bottom-player-subtitle');
  const spotifyContainer = document.getElementById('bottom-player-embed-container');
  const scContainer = document.getElementById('bottom-player-sc-container');
  if (!bar || !scContainer) return;

  if (art) {
    art.src = item.coverImage || '';
    art.alt = item.title || 'Track Artwork';
  }
  // For podcasts, display show name as headline and genre badge as subtitle
  if (item.show) {
    if (title) title.textContent = item.show;
    if (subtitle) subtitle.textContent = item.badge || 'Podcast';
  } else {
    if (title) title.textContent = item.title || '';
    const metaSubtitle = item.company || item.ensemble || '';
    if (subtitle) subtitle.textContent = (metaSubtitle ? `${metaSubtitle} · ` : '') + (item.badge || 'Audio');
  }

  // Switch to SoundCloud mode
  if (spotifyContainer) spotifyContainer.style.display = 'none';
  scContainer.style.display = 'flex';

  const secretParam = item.soundcloudSecret ? `%3Fsecret_token%3D${encodeURIComponent(item.soundcloudSecret)}` : '';
  scContainer.innerHTML = `<iframe
    id="bottom-sc-iframe"
    width="100%"
    height="100%"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundcloudTrackId}${secretParam}&color=%231ed760&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false">
  </iframe>`;

  bar.classList.add('is-visible');
  bar.setAttribute('aria-hidden', 'false');

  // Hook into bottom SoundCloud widget to sync pause/play events
  const bottomIframe = document.getElementById('bottom-sc-iframe');
  if (bottomIframe && typeof window.SC !== 'undefined') {
    const bottomWidget = window.SC.Widget(bottomIframe);
    activeAudioWidget = bottomWidget;

    bottomWidget.bind(window.SC.Widget.Events.PLAY, () => {
      if (activePlayingCardId) {
        const card = document.getElementById(activePlayingCardId);
        const btn = card ? card.querySelector('.js-audio-play-btn') : null;
        if (btn) setButtonPlaying(btn, card, true);
      }
    });

    bottomWidget.bind(window.SC.Widget.Events.PAUSE, () => {
      if (activePlayingCardId) {
        const card = document.getElementById(activePlayingCardId);
        const btn = card ? card.querySelector('.js-audio-play-btn') : null;
        if (btn) setButtonPlaying(btn, card, false);
      }
    });

    bottomWidget.bind(window.SC.Widget.Events.FINISH, () => {
      if (activePlayingCardId) {
        const card = document.getElementById(activePlayingCardId);
        const btn = card ? card.querySelector('.js-audio-play-btn') : null;
        if (btn) setButtonPlaying(btn, card, false);
      }
      activePlayingCardId = null;
    });
  }
}

function hideBottomPlayer() {
  const bar = document.getElementById('bottom-player-bar');
  const scContainer = document.getElementById('bottom-player-sc-container');
  if (!bar) return;
  bar.classList.remove('is-visible');
  bar.setAttribute('aria-hidden', 'true');
  if (scContainer) {
    scContainer.innerHTML = '';
    scContainer.style.display = 'none';
  }
}

function initBottomPlayer() {
  const closeBtn = document.getElementById('bottom-player-close');
  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = 'true';
    closeBtn.addEventListener('click', () => {
      stopActiveSpotify();
      stopActiveSoundCloud();
    });
  }
}

function stopActiveSoundCloud() {
  if (activeAudioWidget) {
    try { activeAudioWidget.pause(); } catch (err) {}
  }
  if (activePlayingCardId) {
    const prevCard = document.getElementById(activePlayingCardId);
    const prevBtn = prevCard ? prevCard.querySelector('.js-audio-play-btn') : null;
    if (prevBtn) setButtonPlaying(prevBtn, prevCard, false);
  }
  activeAudioWidget = null;
  activePlayingCardId = null;
  hideBottomPlayer();
}

function findMediaItemById(id) {
  if (typeof SITE_CONFIG === 'undefined') return null;
  const pools = [
    SITE_CONFIG.podcastEpisodes,
    SITE_CONFIG.musicalProductions,
    SITE_CONFIG.acousticRecordings,
    SITE_CONFIG.games
  ];
  for (const list of pools) {
    if (Array.isArray(list)) {
      const found = list.find(x => x.id === id);
      if (found) return found;
    }
  }
  return null;
}

function attachSpotifyAudioControllers() {
  initBottomPlayer();
  const playBtns = document.querySelectorAll('.js-spotify-play-btn');

  playBtns.forEach(btn => {
    if (btn.dataset.spotifyBound === 'true') return;
    btn.dataset.spotifyBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cardId = btn.getAttribute('data-card-id');
      const spotifyUri = btn.getAttribute('data-spotify-uri');
      const card = document.getElementById(cardId);

      // Extract episode ID from uri (e.g. spotify:episode:6dg5bkKWgZ6InAym2lKAqq)
      const episodeId = (spotifyUri || '').replace('spotify:episode:', '');

      // If clicking currently active card -> toggle pause / close
      if (activeSpotifyCardId === cardId) {
        if (spotifyEmbedController) {
          try { spotifyEmbedController.togglePlay(); } catch (err) {}
        } else {
          stopActiveSpotify();
        }
        return;
      }

      // Stop any other active players across all types
      stopActiveSpotify();
      stopActiveSoundCloud();
      stopActiveYouTube();

      // Find item metadata in SITE_CONFIG
      const item = findMediaItemById(cardId);

      if (spotifyUri && item) {
        showBottomPlayer(item, spotifyUri, episodeId);
      }

      activeSpotifyCardId = cardId;
      setButtonPlaying(btn, card, true);
    });
  });
}

/**
 * Attaches SoundCloud Widget playback to the green play button and routes it to the floating bottom player bar
 */
function attachInlineAudioControllers() {
  initBottomPlayer();
  const playBtns = document.querySelectorAll('.js-audio-play-btn');

  playBtns.forEach(btn => {
    if (btn.dataset.scBound === 'true') return;
    btn.dataset.scBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cardId = btn.getAttribute('data-card-id');
      const card = document.getElementById(cardId);

      // If clicking already playing track -> toggle pause
      if (activePlayingCardId === cardId && activeAudioWidget) {
        activeAudioWidget.isPaused((paused) => {
          if (paused) {
            activeAudioWidget.play();
            setButtonPlaying(btn, card, true);
          } else {
            activeAudioWidget.pause();
            setButtonPlaying(btn, card, false);
          }
        });
        return;
      }

      // If switching to a new track, pause any previously playing track
      stopActiveSpotify();
      stopActiveSoundCloud();
      stopActiveYouTube();

      const item = findMediaItemById(cardId);
      if (item && item.soundcloudTrackId) {
        activePlayingCardId = cardId;
        setButtonPlaying(btn, card, true);
        showBottomPlayerSoundCloud(item);
      }
    });
  });
}

let activeYtCardId = null;

function showPipVideo(item, ytId) {
  const pip = document.getElementById('pip-video-player');
  const title = document.getElementById('pip-video-title');
  const embed = document.getElementById('pip-video-embed');
  if (!pip || !embed) return;

  if (title) title.textContent = item.title || 'Video Player';

  embed.innerHTML = `<iframe
    width="100%"
    height="100%"
    src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    title="${escapeHTML(item.title)} Video Preview"
  ></iframe>`;

  pip.classList.add('is-visible');
  pip.setAttribute('aria-hidden', 'false');
}

function hidePipVideo() {
  const pip = document.getElementById('pip-video-player');
  const embed = document.getElementById('pip-video-embed');
  if (!pip) return;
  pip.classList.remove('is-visible');
  pip.setAttribute('aria-hidden', 'true');
  if (embed) embed.innerHTML = '';
}

function initPipVideo() {
  const closeBtn = document.getElementById('pip-video-close');
  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = 'true';
    closeBtn.addEventListener('click', () => {
      stopActiveYouTube();
    });
  }
}

function stopActiveYouTube() {
  if (!activeYtCardId) return;
  const prevCard = document.getElementById(activeYtCardId);
  const prevBtn = prevCard ? prevCard.querySelector('.js-yt-play-btn') : null;
  if (prevBtn) setButtonPlaying(prevBtn, prevCard, false);
  activeYtCardId = null;
  hidePipVideo();
}

function attachYouTubeControllers() {
  initPipVideo();
  const playBtns = document.querySelectorAll('.js-yt-play-btn');

  playBtns.forEach(btn => {
    if (btn.dataset.ytBound === 'true') return;
    btn.dataset.ytBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cardId = btn.getAttribute('data-card-id');
      const ytId = btn.getAttribute('data-yt-id');
      const card = document.getElementById(cardId);

      // If clicking the currently active video card — close/stop it
      if (activeYtCardId === cardId) {
        stopActiveYouTube();
        return;
      }

      // Stop any other media playing across Spotify, SoundCloud, or another YouTube video
      stopActiveSpotify();
      stopActiveSoundCloud();
      stopActiveYouTube();

      const item = findMediaItemById(cardId);
      if (item && ytId) {
        activeYtCardId = cardId;
        setButtonPlaying(btn, card, true);
        showPipVideo(item, ytId);
      }
    });
  });
}

function setButtonPlaying(btn, card, isPlaying) {
  const iconPlay = btn.querySelector('.icon-play');
  const iconPause = btn.querySelector('.icon-pause');

  if (isPlaying) {
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = 'block';
    btn.classList.add('is-playing');
    if (card) card.classList.add('is-audio-active');
  } else {
    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
    btn.classList.remove('is-playing');
    if (card) card.classList.remove('is-audio-active');
  }
}

/**
 * 5. Render About Me Section
 */
function renderAbout() {
  if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.about) return;
  const about = SITE_CONFIG.about;

  const bioContainer = document.getElementById('about-bio-container');
  if (bioContainer && about.bio) {
    const avatarHtml = (SITE_CONFIG.profile && SITE_CONFIG.profile.avatar) ? `
      <div class="bio-avatar-wrapper">
        <img src="${escapeHTML(SITE_CONFIG.profile.avatar)}" alt="${escapeHTML(SITE_CONFIG.profile.name)}" class="bio-avatar-img" />
      </div>
    ` : '';

    bioContainer.innerHTML = avatarHtml + about.bio
      .map(p => `<p>${escapeHTML(p)}</p>`)
      .join('');
  }
}

/**
 * Safe HTML Escaping (Prevents XSS / Injection)
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

