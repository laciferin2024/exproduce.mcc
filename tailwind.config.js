const plugin = require('tailwindcss/plugin')

module.exports = {
    darkMode: ['class'],
    content: ['./app/**/*.{ts,tsx}'],
  theme: {
  	fontSize: {
  		xs: [
  			'0.75rem',
  			{
  				lineHeight: '1rem'
  			}
  		],
  		sm: [
  			'0.875rem',
  			{
  				lineHeight: '1.25rem'
  			}
  		],
  		base: [
  			'1rem',
  			{
  				lineHeight: '1.5rem'
  			}
  		],
  		lg: [
  			'1.125rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		xl: [
  			'1.25rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		'2xl': [
  			'clamp(1.25rem, 3vw + 1rem, 1.5rem)',
  			{
  				lineHeight: '2rem'
  			}
  		],
  		'3xl': [
  			'clamp(1.5rem, 4vw + 1rem, 1.875rem)',
  			{
  				lineHeight: '2.25rem'
  			}
  		]
  	},
  	extend: {
  		spacing: {
  			'tap-target': '48px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#2E7D32',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#1976D2',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  			heading: ['Inter', 'system-ui', 'sans-serif']
  		}
  	}
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.container': {
          width: '100%',
          '@screen sm': { maxWidth: '640px' },
          '@screen md': { maxWidth: '768px' },
          '@screen lg': { maxWidth: '1024px' },
          '@screen xl': { maxWidth: '1280px' }
        }
      })
    }),
      require("tailwindcss-animate")
]
}