/**
 * Bio Beauty Nexus - Built-in High-Fidelity Demo Presets
 * Enables complete zero-setup demonstration of skin and hair analysis flows.
 */

function createFaceSvg(skinColor, cheekColor, eyeShadowColor, shineOpacity = 0.2, rednessOpacity = 0.1, textureDots = false, isBlur = false) {
  const filter = isBlur ? 'filter="url(#blurEffect)"' : '';
  const blurDef = isBlur ? `
    <filter id="blurEffect" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  ` : '';

  let dotsSvg = '';
  if (textureDots) {
    dotsSvg = `
      <g opacity="0.4" fill="#8B5A2B">
        <circle cx="170" cy="245" r="1.5"/>
        <circle cx="178" cy="252" r="1.2"/>
        <circle cx="185" cy="240" r="1.5"/>
        <circle cx="215" cy="242" r="1.4"/>
        <circle cx="225" cy="250" r="1.2"/>
        <circle cx="230" cy="244" r="1.5"/>
        <circle cx="196" cy="230" r="1.3"/>
        <circle cx="204" cy="232" r="1.2"/>
      </g>
    `;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2d241e"/>
        <stop offset="100%" stop-color="#140f0c"/>
      </linearGradient>
      <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${cheekColor}" stop-opacity="${rednessOpacity}"/>
        <stop offset="100%" stop-color="${cheekColor}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="shineGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="${shineOpacity}"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      ${blurDef}
    </defs>
    
    <rect width="400" height="500" fill="url(#bgGrad)"/>
    
    <g ${filter}>
      <path d="M 110,180 C 80,260 70,360 80,450 L 320,450 C 330,360 320,260 290,180 Z" fill="url(#hairGrad)"/>
      <path d="M 160,330 L 160,420 L 70,500 L 330,500 L 240,420 L 240,330 Z" fill="#e5c29f"/>
      <path d="M 160,330 C 180,360 220,360 240,330 Z" fill="#d2a679" opacity="0.4"/>
      <path d="M 200,90 C 120,90 120,200 130,270 C 140,330 170,370 200,370 C 230,370 260,330 270,270 C 280,200 280,90 200,90 Z" fill="${skinColor}"/>
      <path d="M 145,175 Q 170,165 185,175" stroke="#3d2b1f" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M 255,175 Q 230,165 215,175" stroke="#3d2b1f" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      
      <ellipse cx="165" cy="195" rx="16" ry="9" fill="#ffffff"/>
      <circle cx="165" cy="195" r="7" fill="#4a3728"/>
      <circle cx="167" cy="193" r="2.5" fill="#ffffff"/>
      <path d="M 148,195 Q 165,182 182,195" stroke="#2b1d0c" stroke-width="2.5" fill="none"/>

      <ellipse cx="235" cy="195" rx="16" ry="9" fill="#ffffff"/>
      <circle cx="235" cy="195" r="7" fill="#4a3728"/>
      <circle cx="237" cy="193" r="2.5" fill="#ffffff"/>
      <path d="M 218,195 Q 235,182 252,195" stroke="#2b1d0c" stroke-width="2.5" fill="none"/>

      <path d="M 150,208 Q 165,216 180,208" stroke="${eyeShadowColor}" stroke-width="2.5" stroke-opacity="0.3" fill="none"/>
      <path d="M 220,208 Q 235,216 250,208" stroke="${eyeShadowColor}" stroke-width="2.5" stroke-opacity="0.3" fill="none"/>
      
      <path d="M 200,195 L 195,245 Q 200,250 205,245 Z" fill="#d2a679" opacity="0.35"/>
      <ellipse cx="200" cy="245" rx="9" ry="4" fill="#c69566" opacity="0.5"/>
      
      <circle cx="155" cy="250" r="35" fill="url(#cheekGlow)"/>
      <circle cx="245" cy="250" r="35" fill="url(#cheekGlow)"/>
      <ellipse cx="200" cy="240" rx="20" ry="12" fill="url(#cheekGlow)"/>

      <ellipse cx="200" cy="150" rx="30" ry="15" fill="url(#shineGlow)"/>
      <ellipse cx="200" cy="235" rx="10" ry="15" fill="url(#shineGlow)"/>
      <ellipse cx="200" cy="335" rx="15" ry="10" fill="url(#shineGlow)"/>
      
      ${dotsSvg}

      <path d="M 175,295 Q 200,290 225,295 Q 200,318 175,295 Z" fill="#c86d70"/>
      <path d="M 178,295 Q 200,298 222,295" stroke="#8d3d40" stroke-width="1.5" fill="none"/>
      
      <path d="M 125,170 C 130,90 190,70 200,70 C 210,70 270,90 275,170 C 250,110 220,105 200,115 C 180,105 150,110 125,170 Z" fill="url(#hairGrad)"/>
    </g>
  </svg>
  `;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
}

function createHairSvg(style = 'curly', isBlur = false) {
  const filter = isBlur ? 'filter="url(#blurHair)"' : '';
  const blurDef = isBlur ? `
    <filter id="blurHair" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  ` : '';

  let hairElements = '';
  if (style === 'curly') {
    hairElements = `
      <g stroke="#26170d" stroke-width="5" fill="none" opacity="0.9">
        <path d="M 120,160 Q 90,220 130,270 Q 80,320 120,380"/>
        <path d="M 140,140 Q 100,210 150,280 Q 95,350 140,410"/>
        <path d="M 280,160 Q 310,220 270,270 Q 320,320 280,380"/>
        <path d="M 260,140 Q 300,210 250,280 Q 305,350 260,410"/>
        <circle cx="200" cy="120" r="45" fill="#3a2313" stroke="none"/>
      </g>
    `;
  } else if (style === 'frizz') {
    hairElements = `
      <g stroke="#3a2a1f" stroke-width="1.5" fill="none" opacity="0.8">
        <path d="M 110,180 Q 60,200 90,260 Q 50,300 100,360"/>
        <path d="M 100,220 L 70,240"/>
        <path d="M 90,280 L 60,290"/>
        <path d="M 290,180 Q 340,200 310,260 Q 350,300 300,360"/>
        <path d="M 300,220 L 330,240"/>
        <path d="M 310,280 L 340,290"/>
      </g>
    `;
  } else {
    // straight / oily roots
    hairElements = `
      <ellipse cx="200" cy="115" rx="35" ry="12" fill="#ffffff" opacity="0.3"/>
      <path d="M 140,150 L 130,420 M 260,150 L 270,420" stroke="#1f140e" stroke-width="4" fill="none"/>
    `;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <defs>
      <linearGradient id="bgHGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b1329"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      ${blurDef}
    </defs>
    <rect width="400" height="500" fill="url(#bgHGrad)"/>
    <g ${filter}>
      <!-- Head / Scalp Outline -->
      <ellipse cx="200" cy="220" rx="90" ry="120" fill="#e8cbb1"/>
      <ellipse cx="200" cy="380" rx="120" ry="80" fill="#e8cbb1"/>
      
      <!-- Crown & Parting -->
      <path d="M 120,180 C 130,80 270,80 280,180 C 290,280 290,380 270,420 L 130,420 C 110,380 110,280 120,180 Z" fill="#2d1d13"/>
      <path d="M 200,90 L 200,160" stroke="#f0d5be" stroke-width="3" stroke-linecap="round"/>
      ${hairElements}
    </g>
  </svg>
  `;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
}

export const DEMO_PRESETS = [
  {
    id: 'glow',
    title: 'Balanced Radiance',
    subtitle: 'Healthy barrier & optimal hydration',
    badge: 'Balanced Glow',
    presetMode: 'glow',
    image: createFaceSvg('#f5d7b5', '#ff9999', '#7e5a42', 0.45, 0.15, false)
  },
  {
    id: 'dry',
    title: 'Visible Dryness',
    subtitle: 'Surface dehydration & fine texture',
    badge: 'Dry / Flaky Indicators',
    presetMode: 'dry',
    image: createFaceSvg('#eec9a1', '#d98b80', '#5c3a21', 0.05, 0.25, true)
  },
  {
    id: 'oily',
    title: 'T-Zone Shine & Pores',
    subtitle: 'Prominent sebum & pore visibility',
    badge: 'Oily T-Zone',
    presetMode: 'oily',
    image: createFaceSvg('#f0cdab', '#ff9999', '#6d4c3d', 0.6, 0.1, true)
  },
  {
    id: 'redness',
    title: 'Visible Rosy Flushing',
    subtitle: 'Superficial redness & reactive barrier',
    badge: 'Rosy / Redness',
    presetMode: 'redness',
    image: createFaceSvg('#f7d3c0', '#ff3344', '#704235', 0.2, 0.6, false)
  },
  {
    id: 'poor_quality',
    title: 'Safety Test: Poor Image',
    subtitle: 'Blurred / low clarity quality check',
    badge: 'Safety Rejection Test',
    presetMode: 'poor_quality',
    image: createFaceSvg('#f5d7b5', '#ff9999', '#7e5a42', 0.1, 0.1, false, true)
  }
];

export const HAIR_DEMO_PRESETS = [
  {
    id: 'hair_curls',
    title: 'Glossy Defined Curls',
    subtitle: 'Type 3A curls & optimal shine',
    badge: 'Curl Definition',
    presetMode: 'hair_glossy_curls',
    image: createHairSvg('curly')
  },
  {
    id: 'hair_frizz_preset',
    title: 'Frizzy Waves & Flyaways',
    subtitle: 'Cuticle roughness & humidity response',
    badge: 'Frizz & Cuticle Care',
    presetMode: 'hair_frizz',
    image: createHairSvg('frizz')
  },
  {
    id: 'hair_scalp_preset',
    title: 'Scalp Sebum Balancing',
    subtitle: 'Root shine & clarifying focus',
    badge: 'Scalp Care',
    presetMode: 'hair_oily_scalp',
    image: createHairSvg('straight')
  },
  {
    id: 'hair_poor_preset',
    title: 'Safety Test: Blurry Hair',
    subtitle: 'Out of focus quality detection',
    badge: 'Safety Rejection Test',
    presetMode: 'poor_quality',
    image: createHairSvg('curly', true)
  }
];
