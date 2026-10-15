export default function CarSVG({ color }) {
    return (
        <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 62 L28 42 Q45 26 72 25 L128 25 Q155 26 172 45 L185 62 L185 68 L15 68 Z" fill={color} />
            <path d="M58 40 L78 27 L122 27 L142 40 Z" fill="#101114" opacity=".55" />
            <circle cx="55" cy="68" r="13" fill="#101114" stroke="#6f7280" strokeWidth="3" />
            <circle cx="145" cy="68" r="13" fill="#101114" stroke="#6f7280" strokeWidth="3" />
        </svg>
    );
}
