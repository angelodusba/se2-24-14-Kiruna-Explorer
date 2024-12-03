function DocumentIcon({ id, d, inputWidth, inputHeight, colors }) {
  return (
    <svg id={`DocumentIcon${id}`} xmlns="http://www.w3.org/2000/svg" width={inputWidth} height={inputHeight} viewBox={`0 0 ${inputWidth} ${inputHeight}`} version="1.1" style={{ maxWidth: '100%', maxHeight: '100%' }}>
      {colors.map((_: any, index: number) => (
        <defs key={`DocumentIcon${id}-${index}`}>
          <clipPath id={`DocumentIconCut${id}-${index}`}>
            <rect x={index * (inputWidth / colors.length)} y="0" width={inputWidth / colors.length} height={inputHeight} />
          </clipPath>
        </defs>
      ))}
      {colors.map((color: string, index: number) => (
        <g key={`DocumentIcon${id}-${index}`} clipPath={`url(#DocumentIconCut${id}-${index})`}>
          <path d={d}
            stroke="none" fill={color} fillRule="evenodd"
          />
        </g>
      ))}
    </svg>
  );
};

export default DocumentIcon;