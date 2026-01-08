
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/useAuthStore";
import { createOrg } from "@/hooks/orgHooks";
import { showError, showSuccess } from "@/utils/toast";
import { ErrorMessage } from "@/components/custom/ErrorMessage";
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown";
import { ArrowLeft } from "lucide-react";
import { uploadToIPFS } from "@/lib/ipfs";
export default function CreateOrganizationPage() {
  const router = useRouter();
  const { organizations, addOrganization, user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactEmail: user?.email || "",
    contactPhone: user?.phone || "",
    address: "",
    orgCity: "",
    orgState: "",
    orgCountry: "",
    logoFile: null as File | null,
  });

  const [errors, setErrors] = useState<{
    orgName?: string;
    contactName?: string;
    address?: string;
    orgCity?: string;
    orgState?: string;
    orgCountry?: string;
    contactEmail?: string;
    contactPhone?: string;
  }>({});

  // useEffect(() => {
  //   if (organizations.length > 0) {
  //     const firstOrg = organizations[0];
  //     setFormData({
  //       name: firstOrg.orgName || "",
  //       contactName: firstOrg.orgContact || "",
  //       contactEmail: firstOrg.orgEmail || user?.email || "",
  //       contactPhone: firstOrg.orgPhone || user?.phone || "",
  //       address: firstOrg.address || "",
  //       orgCity: firstOrg.city || "",
  //       orgState: firstOrg.state || "",
  //       orgCountry: firstOrg.country || "",
  //       logoFile: null,
  //     });
  //     setAvatarPreview(firstOrg.logo || null);
  //   }
  // }, [organizations, user?.email, user?.phone]);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     handleInputChange("logoFile", file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => setAvatarPreview(reader.result as string);
  //     reader.readAsDataURL(file);
  //   }
  // };
const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    handleInputChange("logoFile", file); // keep File object in state
    setAvatarPreview(URL.createObjectURL(file)); // local preview
  }
};

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

//   const handleCreateOrg = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setErrors({});
//     const newErrors: typeof errors = {};
//     if (!formData.name.trim()) newErrors.orgName = "Organization name is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
//     if (!formData.orgCity.trim()) newErrors.orgCity = "City is required";
//     if (!formData.orgState.trim()) newErrors.orgState = "State is required";
//     if (!formData.orgCountry.trim()) newErrors.orgCountry = "Country is required";
//     if (!formData.contactName.trim()) newErrors.contactName = "Contact Name is required";
//     if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact Email is required";
//     if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact Phone is required";
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const newOrg = {
//         name: formData.name,
//         contactName: formData.contactName,
//         contactEmail: formData.contactEmail,
//         contactPhone: formData.contactPhone,
//         address: formData.address,
//         orgCity: formData.orgCity,
//         orgState: formData.orgState,
//         orgCountry: formData.orgCountry,
//         logo: avatarPreview || null,
//       };

//       const response = await createOrg(newOrg);
//       addOrganization(response.data);
//       showSuccess("Organization created successfully");
//       router.push(`/${response.data.orgId}/dashboard`);
//     }catch (error: any) {
//   const errorMessage =
//     error?.response?.data?.message || error.message || "Failed to create organization";
//   showError(errorMessage);
// }
//   finally {
//       setIsLoading(false);
//     }
//   };
const handleCreateOrg = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  const newErrors: typeof errors = {};

  // validations...
  if (!formData.name?.trim()) newErrors.orgName = "Organization name is required";
  if (!formData.address?.trim()) newErrors.address = "Address is required";
  if (!formData.orgCity?.trim()) newErrors.orgCity = "City is required";
  if (!formData.orgState?.trim()) newErrors.orgState = "State is required";
  if (!formData.orgCountry?.trim()) newErrors.orgCountry = "Country is required";
  if (!formData.contactName?.trim()) newErrors.contactName = "Contact Name is required";
  if (!formData.contactEmail?.trim()) newErrors.contactEmail = "Contact Email is required";
  if (!formData.contactPhone?.trim()) newErrors.contactPhone = "Contact Phone is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    let logoUrl = "";
    if (formData.logoFile instanceof File) {
      logoUrl = await uploadToIPFS(formData.logoFile); // upload file here
    }

    const newOrg = {
      name: formData.name,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      orgCity: formData.orgCity,
      orgState: formData.orgState,
      orgCountry: formData.orgCountry,
      logo: logoUrl || null, // store IPFS URL instead of base64
    };

    const response = await createOrg(newOrg);
    addOrganization(response.data);
    showSuccess("Organization created successfully");
    router.push(`/${response.data.orgId}/dashboard`);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error.message || "Failed to create organization";
    showError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-gradient-to-br bg-primary/80 p-4 relative">
 {/* Back Button - fixed at top left */}
<div className="absolute top-4 left-4">
  <Button 
    variant="outline"
    className="shadow-md border border-gray-300 flex items-center gap-2"
    onClick={() => router.back()}
  >
    <ArrowLeft className="w-4 h-4" />
    Back
  </Button>
</div>
  {/* Centered Card */}
  <div className="flex items-center justify-center  h-[90vh]  overflow-y-auto hide-scrollbar ">
    <div className="w-full max-w-2xl  mt-8 ">
      <Card className="shadow-2xl border-0  m-3 mt-8 ">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center relative w-24 h-24 mx-auto">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="org logo" />
              ) : (
                <AvatarFallback className="bg-primary text-white text-lg">
                  <Building2 className="w-6 h-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleLogoChange}
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary/90">Create Your Organization</CardTitle>
            <CardDescription className="text-gray-600">Set up your organization to continue</CardDescription>
          </div>
        </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleCreateOrg} className="space-y-4">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgName"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter organization name"
                  className="h-11"
                />
                <ErrorMessage message={errors.orgName} />
              </div>

              {/* Contact Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    className="h-11"
                  />
                  <ErrorMessage message={errors.contactName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="Enter contact email"
                    className="h-11"
                  />
                  <ErrorMessage message={errors.contactEmail} />
                </div>
              </div>

              {/* Phone & Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="Enter contact phone"
                    className="h-11"
                  />
                  <ErrorMessage message={errors.contactPhone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street, Building, Area"
                    className="h-11"
                  />
                  <ErrorMessage message={errors.address} />
                </div>
              </div>

              {/* Country, State, City */}
             <CountryStateCityDropdown
  handleChange={handleDropdownChange}
  countryName="orgCountry"
  stateName="orgState"
  cityName="orgCity"
/>

              <div className="grid grid-cols-3 gap-4">
                <ErrorMessage message={errors.orgCountry} />
                <ErrorMessage message={errors.orgState} />
                <ErrorMessage message={errors.orgCity} />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary/90 hover:bg-primary"
                disabled={isLoading || !formData.name}
              >
                {isLoading ? "Creating Organization..." : "Create Organization"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
