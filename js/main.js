// =============================================================================
//                          STARS ANIMATION SECTION
// =============================================================================

function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 120;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        const colors = ['#c5a059', '#d4b158', '#dbc378', '#f3e5ab', '#a68241'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            background: radial-gradient(circle, ${color}, transparent 70%);
            box-shadow: 0 0 ${size * 2}px ${size}px ${color}30;
            border-radius: 50%;
            position: absolute;
            pointer-events: none;
        `;
        
        container.appendChild(star);
        
        // Animate each star
        animateStar(star, size, color);
    }
}

function animateStar(star, size, color) {
    const duration = Math.random() * 20000 + 15000; // 15-35 seconds
    const floatX = (Math.random() - 0.5) * 80;
    const floatY = (Math.random() - 0.5) * 80;
    const startOpacity = Math.random() * 0.4 + 0.3;
    const endOpacity = Math.random() * 0.8 + 0.6;
    
    const startX = parseFloat(star.style.left);
    const startY = parseFloat(star.style.top);
    
    let startTime = null;
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = (elapsed % duration) / duration;
        
        // Smooth sine wave for position
        const offsetX = Math.sin(progress * Math.PI * 2) * floatX;
        const offsetY = Math.sin(progress * Math.PI * 2) * floatY;
        
        // Smooth sine wave for opacity (different phase)
        const opacityProgress = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
        const opacity = startOpacity + (endOpacity - startOpacity) * opacityProgress;
        
        // Subtle bloom based on opacity
        const bloomSize = size * 1.5;
        
        star.style.left = `calc(${startX}% + ${offsetX}px)`;
        star.style.top = `calc(${startY}% + ${offsetY}px)`;
        star.style.opacity = opacity;
        star.style.boxShadow = `0 0 ${bloomSize * 2}px ${bloomSize}px ${color}${Math.floor(opacity * 40).toString(16)}`;
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

createStars();

// =============================================================================
//                            TAB SWITCHING LOGIC
// =============================================================================

let activeTab = 'completed';

function switchTab(tab) {
    if (activeTab === tab) return;
    
    activeTab = tab;
    
    // Update buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#57534e';
    });
    
    const activeButton = document.getElementById(`tab${tab === 'completed' ? 'Completed' : 'Wishlist'}`);
    activeButton.classList.add('active');
    activeButton.style.color = '#e8d9a8';
    
    // Update content with smooth transition
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.style.opacity = '0';
        setTimeout(() => {
            content.classList.add('hidden');
            content.classList.remove('active');
        }, 200);
    });
    
    const activeContent = document.getElementById(`content${tab === 'completed' ? 'Completed' : 'Wishlist'}`);
    setTimeout(() => {
        activeContent.classList.remove('hidden');
        setTimeout(() => {
            activeContent.classList.add('active');
            activeContent.style.opacity = '1';
        }, 10);
    }, 200);
}

// =============================================================================
//                           GAME LISTS & DATA
// =============================================================================

let playedGames = [];
let toPlayGames = [];

// =============================================================================
//                         SEARCH MODAL CONTROLS
// =============================================================================

function openSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput').focus(), 200);
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = `
        <div class="text-center py-16 sm:py-20">
            <svg class="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 text-gold-500/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <p class="text-stone-700 font-display italic tracking-wide text-sm sm:text-base">Begin your search...</p>
        </div>
    `;
}

// =============================================================================
//                      RENDER GAME LISTS FUNCTION
// =============================================================================

function updateLists() {
    const emptyMsg = `
        <div class="flex items-center justify-center" style="min-height: 380px;">
            <div class="text-center">
                <svg class="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 text-stone-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-stone-700/70 font-display italic text-sm sm:text-base">Empty collection</p>
            </div>
        </div>
    `;

    const renderGame = (game, i, listType) => {
        const genres = game.genres?.slice(0, 3).map(g => g.name).join(', ') || 'Unknown';
        const developer = game.developers?.[0]?.name || game.publishers?.[0]?.name || 'Unknown';
        const releaseDate = game.released ? new Date(game.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA';
        
        return `
            <div class="group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/15">
                <div class="glass-effect overflow-hidden">
                    <!-- Image Section -->
                    <div class="relative aspect-[16/9] overflow-hidden">
                        ${game.background_image 
                            ? `<img src="${game.background_image}" class="w-full h-full object-cover transition-all duration-700" loading="lazy">` 
                            : `<div class="w-full h-full bg-stone-900 flex items-center justify-center">
                                 <svg class="w-16 h-16 sm:w-20 sm:h-20 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                 </svg>
                               </div>`}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        
                        <!-- Delete Button -->
                        <button 
                            onclick="removeFrom${listType}(${i})" 
                            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-stone-400 hover:text-gold-400 p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 active:scale-90 z-10"
                            aria-label="Remove game"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Content Section -->
                    <div class="p-5 sm:p-6">
                        <!-- Title -->
                        <h3 class="font-display text-xl sm:text-2xl text-gold-100 mb-3 sm:mb-4 leading-tight group-hover:text-gold-200 transition-colors">${game.name}</h3>
                        
                        <!-- Info Grid -->
                        <div class="space-y-2.5 sm:space-y-3">
                            <!-- Release Date -->
                            <div class="flex items-start gap-3">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gold-500/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[10px] sm:text-xs text-stone-600 uppercase tracking-wider mb-0.5 font-sans">Release Date</p>
                                    <p class="text-xs sm:text-sm text-stone-300 font-sans">${releaseDate}</p>
                                </div>
                            </div>
                            
                            <!-- Developer -->
                            <div class="flex items-start gap-3">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gold-500/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[10px] sm:text-xs text-stone-600 uppercase tracking-wider mb-0.5 font-sans">Developer</p>
                                    <p class="text-xs sm:text-sm text-stone-300 font-sans truncate">${developer}</p>
                                </div>
                            </div>
                            
                            <!-- Genre -->
                            <div class="flex items-start gap-3">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gold-500/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[10px] sm:text-xs text-stone-600 uppercase tracking-wider mb-0.5 font-sans">Genre</p>
                                    <p class="text-xs sm:text-sm text-stone-300 font-sans truncate">${genres}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Bottom accent -->
                    <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold-600/50 via-gold-400/70 to-gold-600/50 w-0 group-hover:w-full transition-all duration-1000"></div>
                </div>
            </div>
        `;
    };

    document.getElementById('playedList').innerHTML = playedGames.length === 0 ? emptyMsg : `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">${playedGames.map((g, i) => renderGame(g, i, 'Played')).join('')}</div>`;
    document.getElementById('toPlayList').innerHTML = toPlayGames.length === 0 ? emptyMsg : `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">${toPlayGames.map((g, i) => renderGame(g, i, 'ToPlay')).join('')}</div>`;
}

// =============================================================================
//                           RAWG API SEARCH FUNCTIONS
// =============================================================================

const API_KEY = '1883e002c9f64139bf04bd4b3f7ce503';

async function searchGames(query) {
    try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=12`);
        const { results } = await res.json();
        
        // Fetch detailed info for each game to get developers
        const detailedResults = await Promise.all(
            results.map(async (game) => {
                try {
                    const detailRes = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`);
                    const details = await detailRes.json();
                    return { ...game, developers: details.developers, publishers: details.publishers };
                } catch {
                    return game;
                }
            })
        );
        
        return detailedResults || [];
    } catch (err) { return []; }
}

async function searchGamesInModal() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const container = document.getElementById('searchResults');
    container.innerHTML = `
        <div class="text-center py-16 sm:py-20">
            <div class="inline-block animate-pulse">
                <div class="w-11 h-11 sm:w-12 sm:h-12 border-[3px] border-gold-500/20 border-t-gold-500/60 rounded-full animate-spin mx-auto mb-4 sm:mb-5"></div>
            </div>
            <p class="text-gold-400/50 font-display italic text-sm sm:text-base">Searching...</p>
        </div>
    `;

    const games = await searchGames(query);

    if (games.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 sm:py-20">
                <svg class="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-stone-600 font-display italic text-sm sm:text-base mb-1.5">No games found</p>
                <p class="text-stone-700/70 text-xs sm:text-sm font-sans">Try a different search</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            ${games.map((game, index) => {
                const genres = game.genres?.slice(0, 3).map(g => g.name).join(', ') || 'Unknown';
                const developer = game.developers?.[0]?.name || game.publishers?.[0]?.name || 'Unknown';
                const releaseDate = game.released ? new Date(game.released).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'TBA';
                
                return `
                <div class="glass-effect group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold-500/10 hover:border-gold-500/30" style="animation: scaleIn 0.4s ease-out ${index * 0.04}s forwards; opacity: 0;">
                    <div class="aspect-[16/9] overflow-hidden relative">
                        ${game.background_image 
                            ? `<img src="${game.background_image}" class="w-full h-full object-cover transition-all duration-700" loading="lazy">` 
                            : `<div class="w-full h-full bg-stone-900 flex items-center justify-center">
                                 <svg class="w-12 h-12 sm:w-14 sm:h-14 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                 </svg>
                               </div>`}
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    </div>
                    <div class="p-4 sm:p-5">
                        <h3 class="font-display text-base sm:text-lg text-gold-100 mb-2 sm:mb-3 min-h-[2.5rem] line-clamp-2 leading-tight">${game.name}</h3>
                        
                        <!-- Game Info -->
                        <div class="space-y-1.5 mb-4">
                            <div class="flex items-center gap-2 text-xs text-stone-400">
                                <svg class="w-3.5 h-3.5 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="truncate">${releaseDate}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-stone-400">
                                <svg class="w-3.5 h-3.5 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <span class="truncate">${developer}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-stone-400">
                                <svg class="w-3.5 h-3.5 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                <span class="truncate">${genres}</span>
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                            <button 
                                onclick='addToPlayed(${JSON.stringify(game).replace(/'/g, "&apos;")})'
                                class="flex-1 py-2.5 sm:py-3 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase border border-gold-500/50 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-500 rounded-lg font-light active:scale-95"
                            >
                                Complete
                            </button>
                            <button 
                                onclick='addToToPlay(${JSON.stringify(game).replace(/'/g, "&apos;")})'
                                class="flex-1 py-2.5 sm:py-3 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase border border-gold-500/30 text-stone-400 hover:bg-gold-500/5 hover:border-gold-500/40 hover:text-gold-400 transition-all duration-500 rounded-lg font-light active:scale-95"
                            >
                                Wishlist
                            </button>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold-600/50 via-gold-400/70 to-gold-600/50 w-0 group-hover:w-full transition-all duration-1000"></div>
                </div>
            `}).join('')}
        </div>
    `;
}

// =============================================================================
//                        ADD / REMOVE GAME FUNCTIONS
// =============================================================================

function addToPlayed(game) {
    if (!playedGames.some(g => g.id === game.id)) {
        playedGames.push(game);
        updateLists();
    }
}

function addToToPlay(game) {
    if (!toPlayGames.some(g => g.id === game.id)) {
        toPlayGames.push(game);
        updateLists();
    }
}

function removeFromPlayed(index) {
    playedGames.splice(index, 1);
    updateLists();
}

function removeFromToPlay(index) {
    toPlayGames.splice(index, 1);
    updateLists();
}

// =============================================================================
//                          EVENT LISTENERS & INIT
// =============================================================================

document.getElementById('searchModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'searchModal') closeSearchModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearchModal();
});

updateLists();