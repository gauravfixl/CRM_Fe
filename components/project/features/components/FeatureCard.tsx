// // components/FeatureCard.tsx
// import React from 'react';

// type FeatureCardProps = {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   learnMoreLink?: string;
//   enabled: boolean;
//   onToggle: () => void;
//   configurable?: boolean;
// };

// const FeatureCard: React.FC<FeatureCardProps> = ({
//   icon,
//   title,
//   description,
//   learnMoreLink,
//   enabled,
//   onToggle,
//   configurable = false
// }) => {
//   return (
//     <div className="flex justify-between items-center border rounded-lg p-4 bg-white shadow-sm">
//       <div className="flex items-start gap-4">
//         <div className="w-12">{icon}</div>
//         <div>
//           <h3 className="font-semibold text-sm">{title}</h3>
//           <p className="text-gray-600 text-sm">
//             {description}{' '}
//             {learnMoreLink && (
//               <a href={learnMoreLink} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
//                 Learn more about {title}
//               </a>
//             )}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         {configurable && <button className="border px-2 py-1 rounded text-sm">Configure...</button>}
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input type="checkbox" checked={enabled} onChange={onToggle} className="sr-only peer" />
//           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 transition-all"></div>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default FeatureCard;
// components/FeatureCard.tsx
import React from 'react';

type FeatureCardProps = {
  emoji: string;
  title: string;
  description: string;
  learnMoreLink?: string;
  enabled: boolean;
  onToggle: () => void;
  configurable?: boolean;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  emoji,
  title,
  description,
  learnMoreLink,
  enabled,
  onToggle,
  configurable = false
}) => {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{emoji}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm max-w-md">
            {description}{' '}
            {learnMoreLink && (
              <a href={learnMoreLink} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                Learn more about {title}
              </a>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {configurable && (
          <button className="border px-2 py-1 rounded text-sm hover:bg-gray-100">Configure...</button>
        )}

        {/* ✅ Improved Toggle Switch */}
        <label className="relative inline-block w-12 h-6 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={onToggle}
          />
          <div className="absolute inset-0 bg-gray-300 peer-checked:bg-green-600 rounded-full transition-all"></div>
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
              transition-transform peer-checked:translate-x-6
            `}
          />
        </label>
      </div>
    </div>
  );
};

export default FeatureCard;
