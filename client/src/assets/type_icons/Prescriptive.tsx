function PrescriptiveIcon({ colors }) {
  return (
    <svg id="PrescriptiveIcon" xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="0 0 118 118" version="1.1" style={{ maxWidth: '100%', maxHeight: '100%' }}>
      {colors.map((_: any, index: number) => (
        <defs key={`PrescriptiveIcon${index}`}>
          <clipPath id={`PrescriptiveIconCut${index}`}>
            <rect x={index * (118 / colors.length)} y="0" width={118 / colors.length} height="118" />
          </clipPath>
        </defs>
      ))}
      {colors.map((color: string, index: any) => (
        <g key={`PrescriptiveIcon${index}`} clipPath={`url(#PrescriptiveIconCut${index})`}>
          <path d="M 38 6.657 C 33.939 7.982, 32.004 9.550, 31.048 12.293 C 30.472 13.946, 30 22.656, 30 31.649 L 30 48 39.500 48 L 49 48 49 43 C 49 40.250, 49.384 38, 49.853 38 C 51.119 38, 76.453 60.022, 76.785 61.411 C 77.035 62.457, 50.955 86, 49.546 86 C 49.246 86, 49 83.525, 49 80.500 L 49 75 39.500 75 L 30 75 30 89.953 C 30 106.295, 30.711 109.282, 35.145 111.575 C 39.197 113.670, 104.803 113.670, 108.855 111.575 C 113.856 108.989, 114 107.744, 114 67.178 L 114 29.450 106.750 22.427 C 102.763 18.564, 97.171 13.301, 94.323 10.731 L 89.147 6.057 64.323 6.112 C 50.671 6.143, 38.825 6.388, 38 6.657 M 50.807 46.250 L 50.500 50.500 28.716 50.770 L 6.933 51.039 7.216 61.770 L 7.500 72.500 29.250 72.770 L 51 73.039 51 77.020 C 51 79.209, 51.275 81, 51.611 81 C 52.423 81, 73.833 62.671, 73.927 61.895 C 74.004 61.261, 52.360 42, 51.570 42 C 51.320 42, 50.977 43.913, 50.807 46.250"
            stroke="none" fill={color} fillRule="evenodd"
          />
        </g>
      ))}
    </svg>
  );
};

export default PrescriptiveIcon;