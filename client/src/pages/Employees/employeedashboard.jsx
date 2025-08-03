
import React, { useEffect, useState } from "react";

export const EmployeeDashboard = () =>{
//     return(
//         <div className="bg-red-500 text-4xl font-bold flex justify-center items-center">
//             <p>This is The Dashbaord</p>
//         </div>
//     )

 const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Employee Profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/employee/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setEmployee(data.data || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // 🔹 Fetch Salaries
  const fetchSalaries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/employee/salaries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setSalaries(data.data || []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  // 🔹 Update Attendance
  const handleUpdateAttendance = async () => {
    try {
      const currentdate = new Date().toISOString().split("T")[0];
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/attendance/update-attendance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attendanceID: employee?.attendance, // employee ki attendance ID
          status,
          currentdate,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
      await fetchSalaries();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* 🔹 Employee Info */}
      <div className="border rounded-lg shadow p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>
        {employee ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {employee.firstname} {employee.lastname}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Department:</strong> {employee.department?.name || "N/A"}</p>
            <p><strong>Contact:</strong> {employee.contactnumber}</p>
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>

      {/* 🔹 Salary Records */}
      <div className="border rounded-lg shadow p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Salary Records</h2>
        {salaries && salaries.length > 0 ? (
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Basic Pay</th>
                <th className="p-2">Bonuses</th>
                <th className="p-2">Deductions</th>
                <th className="p-2">Net Pay</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((s) => (
                <tr key={s._id} className="border-t text-center">
                  <td>{s.basicpay}</td>
                  <td>{s.bonuses}</td>
                  <td>{s.deductions}</td>
                  <td>{s.netpay}</td>
                  <td>{new Date(s.duedate).toLocaleDateString()}</td>
                  <td>{s.status}</td>
                  <td>{s.paymentdate ? new Date(s.paymentdate).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No salary records available.</p>
        )}
      </div>

      {/* 🔹 Attendance Update */}
      <div className="border rounded-lg shadow p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Attendance</h2>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Not Specified">Not Specified</option>
          </select>
          <button
            onClick={handleUpdateAttendance}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
















// import React, { useEffect, useState } from "react";

// const employeeDashboard = () => {
//   const [employee, setEmployee] = useState(null);
//   const [salaries, setSalaries] = useState([]);
//   const [status, setStatus] = useState("Present");
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch Employee Profile
//   const fetchProfile = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE}/employee/me`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const data = await res.json();
//       setEmployee(data.data || null);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     }
//   };

//   // 🔹 Fetch Salaries
//   const fetchSalaries = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE}/employee/salaries`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const data = await res.json();
//       setSalaries(data.data || []);
//     } catch (error) {
//       console.error("Error fetching salaries:", error);
//     }
//   };

//   // 🔹 Update Attendance
//   const handleUpdateAttendance = async () => {
//     try {
//       const currentdate = new Date().toISOString().split("T")[0];
//       const res = await fetch(`${import.meta.env.VITE_API_BASE}/attendance/update-attendance`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           attendanceID: employee?.attendance, // employee ki attendance ID
//           status,
//           currentdate,
//         }),
//       });

//       const data = await res.json();
//       alert(data.message);
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchProfile();
//       await fetchSalaries();
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   if (loading) return <p className="p-6">Loading profile...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       {/* 🔹 Employee Info */}
//       <div className="border rounded-lg shadow p-6 bg-white">
//         <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>
//         {employee ? (
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {employee.firstname} {employee.lastname}</p>
//             <p><strong>Email:</strong> {employee.email}</p>
//             <p><strong>Department:</strong> {employee.department?.name || "N/A"}</p>
//             <p><strong>Contact:</strong> {employee.contactnumber}</p>
//           </div>
//         ) : (
//           <p>No profile data available.</p>
//         )}
//       </div>

//       {/* 🔹 Salary Records */}
//       <div className="border rounded-lg shadow p-6 bg-white">
//         <h2 className="text-xl font-semibold mb-4">Salary Records</h2>
//         {salaries && salaries.length > 0 ? (
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-2">Basic Pay</th>
//                 <th className="p-2">Bonuses</th>
//                 <th className="p-2">Deductions</th>
//                 <th className="p-2">Net Pay</th>
//                 <th className="p-2">Due Date</th>
//                 <th className="p-2">Status</th>
//                 <th className="p-2">Payment Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salaries.map((s) => (
//                 <tr key={s._id} className="border-t text-center">
//                   <td>{s.basicpay}</td>
//                   <td>{s.bonuses}</td>
//                   <td>{s.deductions}</td>
//                   <td>{s.netpay}</td>
//                   <td>{new Date(s.duedate).toLocaleDateString()}</td>
//                   <td>{s.status}</td>
//                   <td>{s.paymentdate ? new Date(s.paymentdate).toLocaleDateString() : "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No salary records available.</p>
//         )}
//       </div>

//       {/* 🔹 Attendance Update */}
//       <div className="border rounded-lg shadow p-6 bg-white">
//         <h2 className="text-xl font-semibold mb-4">Attendance</h2>
//         <div className="flex items-center gap-4">
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="border px-2 py-1 rounded"
//           >
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//             <option value="Not Specified">Not Specified</option>
//           </select>
//           <button
//             onClick={handleUpdateAttendance}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Update Attendance
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default employeeDashboard;
