'use client';

import Morpher from '~/components/morpher';

export default function Page() {
  return <Morpher />;
}

// import { useAtomValue, useSetAtom } from 'jotai';
// import * as motion from 'motion/react-client';

// import { navBarModeAtom } from '~/atoms';

// export default function Page() {
//   const navBarMode = useAtomValue(navBarModeAtom);
//   const setNavBarMode = useSetAtom(navBarModeAtom);

//   const handleClick = () => {
//     if (navBarMode === 'collapsed') {
//       setNavBarMode('expanded');
//     } else {
//       setNavBarMode('collapsed');
//     }
//   };

//   return (
//     <div>
//       <h1>favorites</h1>
//       <button onClick={handleClick}>fs</button>
//       {/* <motion.div
//         className="w-48 h-48 bg-blue-300 rounded-full"
//         initial={{ opacity: 0, scale: 0 }}
//         animate={{ opacity: 1, scale: 1 }}
//         whileHover={{ scale: 2 }}
//         transition={{
//           duration: 10,
//           scale: {
//             type: 'spring',
//             visualDuration: 0.7,
//           },
//         }}
//       ></motion.div> */}
//     </div>
//   );
// }

// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';

// type Mode = 'nav' | 'dialog' | 'edit' | 'info';

// const LAYOUTS: Record<Mode, { width: number; height: number; radius: number }> =
//   {
//     nav: { width: 320, height: 60, radius: 16 },
//     dialog: { width: 360, height: 160, radius: 24 },
//     edit: { width: 380, height: 220, radius: 28 },
//     info: { width: 340, height: 120, radius: 20 },
//   };

// export default function BottomBarDemo() {
//   const [mode, setMode] = useState<Mode>('nav');

//   // 控制是否显示背景层，以及是否可点击关闭
//   const showBackdrop = mode !== 'nav';
//   const backdropClosable = true;

//   const layout = LAYOUTS[mode];

//   const close = () => setMode('nav');

//   return (
//     <div className="relative min-h-screen bg-gray-50 flex flex-col justify-end overflow-hidden">
//       {/* === 背景层 === */}
//       <AnimatePresence>
//         {showBackdrop && (
//           <motion.div
//             key="backdrop"
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             onClick={() => {
//               if (backdropClosable) close();
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* === 底部栏主体 === */}
//       <motion.div
//         layout
//         transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//         className={`relative z-10 mx-auto mb-6 bg-white shadow-lg ${
//           showBackdrop ? 'cursor-default' : ''
//         }`}
//         style={{
//           borderRadius: layout.radius,
//           width: layout.width,
//           height: layout.height,
//         }}
//       >
//         <AnimatePresence mode="wait">
//           {mode === 'nav' && (
//             <motion.div
//               key="nav"
//               className="flex items-center justify-around h-full px-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <button className="text-gray-600">🏠 Home</button>
//               <button
//                 className="text-red-500"
//                 onClick={() => setMode('dialog')}
//               >
//                 🗑️ Delete
//               </button>
//               <button className="text-blue-500" onClick={() => setMode('edit')}>
//                 ✏️ Edit
//               </button>
//               <button
//                 className="text-green-500"
//                 onClick={() => setMode('info')}
//               >
//                 ℹ️ Info
//               </button>
//             </motion.div>
//           )}

//           {mode === 'dialog' && (
//             <motion.div
//               key="dialog"
//               className="flex flex-col items-center justify-center h-full px-4"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//             >
//               <p className="mb-3 text-gray-800 font-medium">确定要删除吗？</p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={close}
//                   className="px-3 py-1 bg-gray-200 rounded-md"
//                 >
//                   取消
//                 </button>
//                 <button className="px-3 py-1 bg-red-500 text-white rounded-md">
//                   删除
//                 </button>
//               </div>
//             </motion.div>
//           )}

//           {mode === 'edit' && (
//             <motion.div
//               key="edit"
//               className="flex flex-col items-center justify-center h-full px-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//             >
//               <p className="mb-3 text-gray-800 font-medium">编辑内容</p>
//               <input
//                 className="border px-2 py-1 rounded w-full"
//                 placeholder="输入新标题..."
//               />
//               <button
//                 onClick={close}
//                 className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md"
//               >
//                 保存
//               </button>
//             </motion.div>
//           )}

//           {mode === 'info' && (
//             <motion.div
//               key="info"
//               className="flex flex-col items-center justify-center h-full px-4 text-center"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//             >
//               <p className="text-gray-800 font-medium">版本：v1.0.2</p>
//               <p className="text-gray-500 text-sm">由 Arthur Wang 构建 ✨</p>
//               <button
//                 onClick={close}
//                 className="mt-3 px-3 py-1 bg-gray-200 rounded-md"
//               >
//                 返回
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }
