// import React, { useState } from "react";
//
// const SelectSocialNetwork = ({ isOpen, onClose, socialAccounts, onSelectAccount }) => {
//     const [chosen, setChosen] = useState(null);
//
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//             <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">Chọn tài khoản mạng xã hội</h2>
//
//                 {socialAccounts.map(acc => (
//                     <div
//                         key={acc.id}
//                         className={`border p-3 rounded-lg mb-2 flex justify-between items-center
//                             ${chosen?.id === acc.id ? 'border-blue-500 bg-blue-50' : ''}`}
//                         onClick={() => setChosen(acc)}
//                     >
//                         <div>
//                             <div className="font-medium">{acc.accountName}</div>
//                             <div className="text-xs text-gray-500">{acc.platform}</div>
//                         </div>
//                         <input
//                             type="radio"
//                             checked={chosen?.id === acc.id}
//                             onChange={() => setChosen(acc)}
//                         />
//                     </div>
//                 ))}
//
//                 <div className="text-right mt-4">
//                     <button
//                         disabled={!chosen}
//                         className={`px-4 py-2 rounded-lg text-white text-sm
//                           ${!chosen ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                         onClick={() => {
//                             if (chosen) onSelectAccount(chosen);
//                         }}
//                     >
//                         Xác nhận
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SelectSocialNetwork;
