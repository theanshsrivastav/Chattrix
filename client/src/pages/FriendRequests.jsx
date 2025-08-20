// // src/pages/FriendRequests.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const FriendRequests = ({ userId }) => {
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchFriendRequests = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/friends/requests/${userId}`);
//             setRequests(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching friend requests:', error);
//             setLoading(false);
//         }
//     };

//     const acceptRequest = async (targetUserId) => {
//         try {
//             await axios.post('http://localhost:5000/api/friends/accept', {
//                 userId: targetUserId,
//                 targetUserId: userId,
//             });
//             setRequests(prev => prev.filter(req => req._id !== targetUserId));
//         } catch (error) {
//             console.error('Error accepting request:', error);
//         }
//     };

//     useEffect(() => {
//         fetchFriendRequests();
//     }, []);

//     return (
//         <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Incoming Friend Requests</h2>
//         {loading ? (
//             <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//         ) : requests.length === 0 ? (
//             <p className="text-gray-500 dark:text-gray-400">No friend requests at the moment.</p>
//         ) : (
//             <ul className="space-y-4">
//             {requests.map((req) => (
//                 <li
//                 key={req._id}
//                 className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
//                 >
//                 <div>
//                     <p className="text-lg font-medium text-gray-900 dark:text-white">{req.name}</p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{req.email}</p>
//                 </div>
//                 <button
//                     onClick={() => acceptRequest(req._id)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//                 >
//                     Accept
//                 </button>
//                 </li>
//             ))}
//             </ul>
//         )}
//         </div>
//     );
// };

// export default FriendRequests;
