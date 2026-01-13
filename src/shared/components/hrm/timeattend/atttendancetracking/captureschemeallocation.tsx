// "use client";

// import { useState, useMemo } from "react";
// import { Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Employee {
//   id: number;
//   name: string;
//   title: string;
//   employeeNumber: string;
//   department: string;
//   location: string;
//   manager: string;
//   captureScheme: string;
// }

// const CaptureSchemeAllocation = () => {
//   const [employees, setEmployees] = useState<Employee[]>([
//     {
//       id: 1,
//       name: "Mark Scoffield",
//       title: "Data Analyst",
//       employeeNumber: "1",
//       department: "Customer Success",
//       location: "USA - HQ - California",
//       manager: "Kevin Depp",
//       captureScheme: "US - Capture Scheme",
//     },
//     {
//       id: 2,
//       name: "Nikolas Membre",
//       title: "Business Development",
//       employeeNumber: "1011",
//       department: "Sales",
//       location: "Indore",
//       manager: "Kareem Abbas",
//       captureScheme: "India - Capture Scheme",
//     },
//     {
//       id: 3,
//       name: "Jemima Begum",
//       title: "Business Development",
//       employeeNumber: "1012",
//       department: "Sales",
//       location: "Indore",
//       manager: "Kareem Abbas",
//       captureScheme: "India - Capture Scheme",
//     },
//     {
//       id: 4,
//       name: "Hannah Shaw",
//       title: "Business Development",
//       employeeNumber: "1014",
//       department: "Sales",
//       location: "Bangalore",
//       manager: "Indra Noli",
//       captureScheme: "India - Capture Scheme",
//     },
//   ]);

//   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
//   const [selectedScheme, setSelectedScheme] = useState<string>("");

//   // Filters
//   const [departmentFilter, setDepartmentFilter] = useState<string>("");
//   const [locationFilter, setLocationFilter] = useState<string>("");
//   const [schemeFilter, setSchemeFilter] = useState<string>("");
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Filtered Employees (computed)
//   const filteredEmployees = useMemo(() => {
//     return employees.filter((emp) => {
//       const matchesDepartment = departmentFilter
//         ? emp.department === departmentFilter
//         : true;
//       const matchesLocation = locationFilter
//         ? emp.location === locationFilter
//         : true;
//       const matchesScheme = schemeFilter
//         ? emp.captureScheme === schemeFilter
//         : true;
//       const matchesSearch = searchQuery
//         ? emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           emp.employeeNumber.includes(searchQuery)
//         : true;
//       return (
//         matchesDepartment && matchesLocation && matchesScheme && matchesSearch
//       );
//     });
//   }, [employees, departmentFilter, locationFilter, schemeFilter, searchQuery]);

//   // Select toggling
//   const toggleSelect = (id: number) => {
//     setSelectedEmployees((prev) =>
//       prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
//     );
//   };

//   const allSelected = selectedEmployees.length === filteredEmployees.length;

//   const toggleAll = () => {
//     if (allSelected) setSelectedEmployees([]);
//     else setSelectedEmployees(filteredEmployees.map((e) => e.id));
//   };

//   const openUpdateModal = (employee?: Employee) => {
//     setModalEmployee(employee || null);
//     setSelectedScheme("");
//     setOpenModal(true);
//   };

//   const handleUpdate = () => {
//     if (!selectedScheme) return;

//     setEmployees((prev) =>
//       prev.map((emp) => {
//         if (modalEmployee && emp.id === modalEmployee.id) {
//           return { ...emp, captureScheme: selectedScheme };
//         }
//         if (!modalEmployee && selectedEmployees.includes(emp.id)) {
//           return { ...emp, captureScheme: selectedScheme };
//         }
//         return emp;
//       })
//     );

//     setSelectedEmployees([]);
//     setModalEmployee(null);
//     setSelectedScheme("");
//     setOpenModal(false);
//   };

//   return (
//     <div className="p-6 w-full">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-3 border-b pb-3 mb-3">
//         {/* Department Filter */}
//         <Select
//           value={departmentFilter}
//           onValueChange={(value) => setDepartmentFilter(value)}
//         >
//           <SelectTrigger className="w-[140px] text-xs">
//             <SelectValue placeholder="Department" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All Departments</SelectItem>
//             <SelectItem value="Sales">Sales</SelectItem>
//             <SelectItem value="Customer Success">Customer Success</SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Location Filter */}
//         <Select
//           value={locationFilter}
//           onValueChange={(value) => setLocationFilter(value)}
//         >
//           <SelectTrigger className="w-[140px] text-xs">
//             <SelectValue placeholder="Location" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All Locations</SelectItem>
//             <SelectItem value="Indore">Indore</SelectItem>
//             <SelectItem value="Bangalore">Bangalore</SelectItem>
//             <SelectItem value="USA - HQ - California">
//               USA - HQ - California
//             </SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Capture Scheme Filter */}
//         <Select
//           value={schemeFilter}
//           onValueChange={(value) => setSchemeFilter(value)}
//         >
//           <SelectTrigger className="w-[180px] text-xs">
//             <SelectValue placeholder="Capture Scheme" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All Schemes</SelectItem>
//             <SelectItem value="India - Capture Scheme">
//               India - Capture Scheme
//             </SelectItem>
//             <SelectItem value="US - Capture Scheme">
//               US - Capture Scheme
//             </SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border text-xs px-3 py-1 rounded-md bg-white"
//         />

//         {/* Update Button */}
//         <Button
//           variant="outline"
//           className="text-xs px-3 py-1 border border-primary text-primary"
//           onClick={() => openUpdateModal()}
//           disabled={selectedEmployees.length === 0}
//         >
//           Update Capture Scheme
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded-lg">
//         <table className="min-w-full text-xs text-left border-collapse">
//           <thead className="bg-gray-50 text-gray-500">
//             <tr>
//               <th className="px-3 py-2">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={toggleAll}
//                 />
//               </th>
//               <th className="px-3 py-2 font-medium">Employee</th>
//               <th className="px-3 py-2 font-medium">Employee Number</th>
//               <th className="px-3 py-2 font-medium">Department</th>
//               <th className="px-3 py-2 font-medium">Location</th>
//               <th className="px-3 py-2 font-medium">Reporting Manager</th>
//               <th className="px-3 py-2 font-medium">Capture Scheme</th>
//               <th className="px-3 py-2 font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map((emp) => (
//               <tr key={emp.id} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedEmployees.includes(emp.id)}
//                     onChange={() => toggleSelect(emp.id)}
//                   />
//                 </td>
//                 <td className="px-3 py-2">
//                   <p className="font-medium text-gray-800">{emp.name}</p>
//                   <p className="text-gray-500 text-[10px]">{emp.title}</p>
//                 </td>
//                 <td className="px-3 py-2">{emp.employeeNumber}</td>
//                 <td className="px-3 py-2">{emp.department}</td>
//                 <td className="px-3 py-2">{emp.location}</td>
//                 <td className="px-3 py-2">{emp.manager}</td>
//                 <td className="px-3 py-2">{emp.captureScheme}</td>
//                 <td className="px-3 py-2">
//                   <button
//                     onClick={() => openUpdateModal(emp)}
//                     className="text-gray-500 hover:text-primary"
//                   >
//                     <Pencil size={14} />
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {filteredEmployees.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-center text-gray-400 py-4">
//                   No employees found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Update Capture Scheme Modal */}
//       <Dialog open={openModal} onOpenChange={setOpenModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-sm font-medium">
//               Update Capture Scheme
//             </DialogTitle>
//           </DialogHeader>

//           <div className="mt-2">
//             <p className="text-xs mb-2 text-gray-600">
//               Choose capture scheme to assign
//             </p>
//             <Select
//               value={selectedScheme}
//               onValueChange={(value) => setSelectedScheme(value)}
//             >
//               <SelectTrigger className="w-full text-xs">
//                 <SelectValue placeholder="Select any capture scheme to assign" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="India - Capture Scheme">
//                   India - Capture Scheme
//                 </SelectItem>
//                 <SelectItem value="Remote Employees">
//                   Remote Employees
//                 </SelectItem>
//                 <SelectItem value="SEA - Capture Scheme">
//                   SEA - Capture Scheme
//                 </SelectItem>
//                 <SelectItem value="UK - Capture Scheme">
//                   UK - Capture Scheme
//                 </SelectItem>
//                 <SelectItem value="US - Capture Scheme">
//                   US - Capture Scheme
//                 </SelectItem>
//                 <SelectItem value="Attendance Capture Scheme">
//                   Attendance Capture Scheme
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="mt-4 flex justify-end">
//             <Button
//               onClick={handleUpdate}
//               className="bg-primary text-white text-xs hover:opacity-90"
//             >
//               Update Capture Scheme
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CaptureSchemeAllocation;

"use client";

import { useState, useMemo } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: number;
  name: string;
  title: string;
  employeeNumber: string;
  department: string;
  location: string;
  manager: string;
  captureScheme: string;
}

interface Scheme {
  id: number;
  name: string;
}

// interface CaptureSchemeAllocationProps {
//   employees: Employee[];
//   schemes: Scheme[];
//   onUpdate?: (updatedEmployees: Employee[]) => void;
// }
interface CaptureSchemeAllocationProps {
  employees: Employee[];
  schemes: Scheme[];
  onUpdateSchemes?: (updatedEmployees: Employee[], updatedScheme: string) => void; // ✅ change
}

const CaptureSchemeAllocation = ({
  employees: initialEmployees,
  schemes,
  onUpdateSchemes,
}: CaptureSchemeAllocationProps) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<string>("");

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [schemeFilter, setSchemeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((emp) => {
      const matchesDepartment = departmentFilter
        ? emp.department === departmentFilter
        : true;
      const matchesLocation = locationFilter
        ? emp.location === locationFilter
        : true;
      const matchesScheme = schemeFilter
        ? emp.captureScheme === schemeFilter
        : true;
      const matchesSearch = searchQuery
        ? emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeNumber.includes(searchQuery)
        : true;
      return (
        matchesDepartment && matchesLocation && matchesScheme && matchesSearch
      );
    });
    console.log("Filtered employees:", filtered);
    return filtered;
  }, [employees, departmentFilter, locationFilter, schemeFilter, searchQuery]);

  // Checkbox logic
  const toggleSelect = (id: number) => {
    console.log("Toggling employee:", id);
    console.log("Before toggle, selectedEmployees:", selectedEmployees);

    setSelectedEmployees((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id];
      console.log("After toggle, selectedEmployees:", newSelection);
      return newSelection;
    });
  };

  const allSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((e) => selectedEmployees.includes(e.id));

  const toggleAll = () => {
    console.log("Toggle All triggered");
    if (allSelected) {
      console.log("Unselecting all employees");
      setSelectedEmployees([]);
    } else {
      console.log(
        "Selecting all filtered employees:",
        filteredEmployees.map((e) => e.id)
      );
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
    }
  };

  const openUpdateModal = (employee?: Employee) => {
    console.log("Opening modal. Employee:", employee);
    if (employee) {
      // Pencil click - clear multi-selection
      console.log("Clearing multi-selection for single edit.");
      setSelectedEmployees([]);
    }
    setModalEmployee(employee || null);
    setSelectedScheme("");
    setOpenModal(true);
  };

const handleUpdate = () => {
  console.log("Update triggered");
  console.log("Selected scheme:", selectedScheme);
  console.log("Modal employee:", modalEmployee);
  console.log("Selected employees:", selectedEmployees);

  if (!selectedScheme) {
    console.warn("⚠️ No scheme selected — cannot update");
    return;
  }

  const updatedEmployees = employees.map((emp) => {
    if (modalEmployee && emp.id === modalEmployee.id) {
      console.log(`✅ Updating single employee: ${emp.name}`);
      return { ...emp, captureScheme: selectedScheme };
    }
    if (!modalEmployee && selectedEmployees.includes(emp.id)) {
      console.log(`✅ Updating selected employee: ${emp.name}`);
      return { ...emp, captureScheme: selectedScheme };
    }
    return emp;
  });

  console.log("✅ Updated employees:", updatedEmployees);

  setEmployees(updatedEmployees);

  // ✅ Send both updated employees and selected scheme back to parent
  onUpdateSchemes?.(updatedEmployees, selectedScheme);

  // Reset states
  setSelectedEmployees([]);
  setModalEmployee(null);
  setSelectedScheme("");
  setOpenModal(false);
};



  // Unique options
  const uniqueDepartments = Array.from(
    new Set(initialEmployees.map((e) => e.department))
  );
  const uniqueLocations = Array.from(
    new Set(initialEmployees.map((e) => e.location))
  );
  const uniqueSchemes = Array.from(
    new Set(initialEmployees.map((e) => e.captureScheme))
  );

  return (
    <div className="p-6 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 mb-3">
        <Select
          value={departmentFilter || "all"}
          onValueChange={(value) =>
            setDepartmentFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={locationFilter || "all"}
          onValueChange={(value) =>
            setLocationFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={schemeFilter || "all"}
          onValueChange={(value) =>
            setSchemeFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Capture Scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schemes</SelectItem>
            {uniqueSchemes.map((scheme) => (
              <SelectItem key={scheme} value={scheme}>
                {scheme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border text-xs px-3 py-1 rounded-md bg-white"
        />

        <Button
          variant="outline"
          className="text-xs px-3 py-1 border border-primary text-primary"
          onClick={() => openUpdateModal()}
          disabled={selectedEmployees.length === 0}
        >
          Update Capture Scheme
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2 font-medium">Employee</th>
              <th className="px-3 py-2 font-medium">Employee Number</th>
              <th className="px-3 py-2 font-medium">Department</th>
              <th className="px-3 py-2 font-medium">Location</th>
              <th className="px-3 py-2 font-medium">Reporting Manager</th>
              <th className="px-3 py-2 font-medium">Capture Scheme</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleSelect(emp.id)}
                  />
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-800 text-xs">{emp.name}</p>
                  <p className="text-gray-500 text-[10px]">{emp.title}</p>
                </td>
                <td className="px-3 py-2">{emp.employeeNumber}</td>
                <td className="px-3 py-2">{emp.department}</td>
                <td className="px-3 py-2">{emp.location}</td>
                <td className="px-3 py-2">{emp.manager}</td>
                <td className="px-3 py-2">{emp.captureScheme}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => openUpdateModal(emp)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">
              Update Capture Scheme
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <p className="text-xs mb-2 text-gray-600">
              Choose capture scheme to assign
            </p>
            <Select
              value={selectedScheme}
              onValueChange={(value) => setSelectedScheme(value)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Select capture scheme" />
              </SelectTrigger>
              <SelectContent>
                {schemes.map((scheme) => (
                  <SelectItem key={scheme.id} value={scheme.name}>
                    {scheme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleUpdate}
              className="bg-primary text-white text-xs hover:opacity-90"
            >
              Update Capture Scheme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaptureSchemeAllocation;
