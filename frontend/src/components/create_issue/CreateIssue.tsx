import React, { useRef, useState } from "react";
import IssueSuccessModal from "./IssueSuccessModal";
import { FiX, FiChevronDown, FiUploadCloud } from "react-icons/fi";
import ReactModal from "react-modal";

interface CreateIssueProps {
  isReportedClicked: boolean;
  setIsReportedClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const gramaOptions = ["Moratuwa", "Panadura", "Dehiwala", "Maharagama"];
const cityOptions = ["Moratuwa", "Colombo", "Kandy", "Galle"];
const districtOptions = ["Colombo", "Gampaha", "Kalutara", "Kandy"];
const sectorOptions = [
  "Roads & Transport",
  "Water Supply",
  "Electricity",
  "Waste Management",
  "Other",
];

export default function CreateIssue({ isReportedClicked, setIsReportedClicked }: CreateIssueProps) {
  const [grama, setGrama] = useState(gramaOptions[0]);
  const [city, setCity] = useState(cityOptions[0]);
  const [district, setDistrict] = useState(districtOptions[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [showGramaDropdown, setShowGramaDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [errors, setErrors] = useState<{
    grama?: string;
    city?: string;
    district?: string;
    title?: string;
    description?: string;
    sector?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setPhotos(Array.from(e.dataTransfer.files));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      // Get signature from backend
      const signatureResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate-image-signature`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6InRlc3R1c2VyMUBnbWFpbC5jb20iLCJpYXQiOjE3NTQ5OTQ0MzEsImV4cCI6NDkxMDc1NDQzMX0.PQCLSfMVOJ2yc9D9EutI1HVEc2xJLivr4UjCz_TR-tM`, // Get token from localStorage or your auth provider
          'Content-Type': 'application/json',
        },
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get signature');
      }

      const { signature, timestamp } = await signatureResponse.json();

      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY || '');
      formData.append('folder', 'govpulse-issues');
      
      console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const result = await cloudinaryResponse.json();
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const submitIssueToBackend = async (issueData: {
    grama: string;
    city: string;
    district: string;
    title: string;
    description: string;
    sector: string;
    imageUrls: string[];
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6InRlc3R1c2VyMUBnbWFpbC5jb20iLCJpYXQiOjE3NTQ5OTQ0MzEsImV4cCI6NDkxMDc1NDQzMX0.PQCLSfMVOJ2yc9D9EutI1HVEc2xJLivr4UjCz_TR-tM`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit issue');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting issue:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newErrors: {
      grama?: string;
      city?: string;
      district?: string;
      title?: string;
      description?: string;
      sector?: string;
    } = {};
    
    if (!grama) newErrors.grama = "Please enter a valid Grama Niladhari Division.";
    if (!city) newErrors.city = "Please enter a valid city / town.";
    if (!district) newErrors.district = "Please enter a valid district.";
    if (!title.trim()) newErrors.title = "A short title is required.";
    if (!description.trim() || description.length < 30) newErrors.description = "Description must be at least 30 characters.";
    if (!sector) newErrors.sector = "Please select a department to continue.";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload images to Cloudinary if any
      let imageUrls: string[] = [];
      if (photos.length > 0) {
        console.log('Uploading images to Cloudinary...');
        const uploadPromises = photos.map(photo => uploadImageToCloudinary(photo));
        imageUrls = await Promise.all(uploadPromises);
        console.log('Uploaded image URLs:', imageUrls);
      }

      // Prepare form data
      const formData = {
        grama,
        city,
        district,
        title,
        description,
        sector,
        imageUrls,
      };
      
      console.log('Form submission data:', formData);

      // Submit to backend
      const result = await submitIssueToBackend(formData);
      console.log('Issue submitted successfully:', result);

      // Clear form
      setTitle("");
      setDescription("");
      setSector("");
      setPhotos([]);
      setErrors({});

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ...existing code...
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-grama')) setShowGramaDropdown(false);
      if (!target.closest('.dropdown-city')) setShowCityDropdown(false);
      if (!target.closest('.dropdown-district')) setShowDistrictDropdown(false);
      if (!target.closest('.dropdown-sector')) setShowSectorDropdown(false);
    };
    if (showGramaDropdown || showCityDropdown || showDistrictDropdown || showSectorDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showGramaDropdown, showCityDropdown, showDistrictDropdown, showSectorDropdown]);

  return (
  <>
  <ReactModal
      isOpen={isReportedClicked}
      onRequestClose={() => setIsReportedClicked(false)}
      overlayClassName="fixed inset-0 bg-black/60 z-[1000]"
      className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-[min(92vw,600px)] md:h-auto md:max-h-[90vh] md:rounded-2xl"
      bodyOpenClassName="overflow-hidden"
      ariaHideApp={false}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between gap-8 px-6 py-5 border-b border-gray-200 bg-white rounded-t-2xl">
        <button
          aria-label="Close"
          onClick={() => setIsReportedClicked(false)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiX className="h-6 w-6 text-gray-700" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mx-auto -ml-8">Report an issue</h2>
        <div className="w-8" />
      </div>

  <form className="overflow-y-auto flex-1 px-6 pb-6" onSubmit={handleSubmit}>
        {/* Location Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Where is the issue happening?</h3>
          {/* Grama Niladhari Division Dropdown */}
          <div className="mb-4 dropdown-grama relative">
            <label className="block text-sm text-gray-600 mb-1">Grama Niladhari Division</label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                className={`border ${errors.grama ? 'border-red-500' : 'border-gray-300'} rounded-l-lg p-3 flex-1 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black`}
                value={grama}
                readOnly
                tabIndex={-1}
              />
              <button
                type="button"
                className={`border-t ${errors.grama ? 'border-red-500' : 'border-gray-300'} border-b border-r rounded-r-lg px-3 flex items-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black`}
                onClick={() => setShowGramaDropdown((v) => !v)}
                tabIndex={0}
              >
                {showGramaDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
            </div>
            {errors.grama && <div className="text-red-500 text-xs mt-1">{errors.grama}</div>}
            {showGramaDropdown && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow z-20 max-h-48 overflow-auto">
                {gramaOptions.map((option) => (
                  <li 
                    key={option}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-black ${option === grama ? 'bg-gray-100 font-semibold' : ''}`}
                    onClick={() => { setGrama(option); setShowGramaDropdown(false); }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-2">
            {/* City / Town Dropdown */}
            <div className="flex-1 dropdown-city relative">
              <label className="block text-sm text-gray-600 mb-1">City / Town</label>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-l-lg p-3 flex-1 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black`}
                  value={city}
                  readOnly
                  tabIndex={-1}
                />
                <button
                  type="button"
                  className={`border-t ${errors.city ? 'border-red-500' : 'border-gray-300'} border-b border-r rounded-r-lg px-3 flex items-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black`}
                  onClick={() => setShowCityDropdown((v) => !v)}
                  tabIndex={0}
                >
                  {showCityDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                </button>
              </div>
              {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
              {showCityDropdown && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow z-20 max-h-48 overflow-auto">
                  {cityOptions.map((option) => (
                    <li
                      key={option}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-black ${option === city ? 'bg-gray-100 font-semibold' : ''}`}
                      onClick={() => { setCity(option); setShowCityDropdown(false); }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* District Dropdown */}
            <div className="flex-1 dropdown-district relative">
              <label className="block text-sm text-gray-600 mb-1">District</label>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className={`border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-l-lg p-3 flex-1 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black`}
                  value={district}
                  readOnly
                  tabIndex={-1}
                />
                <button
                  type="button"
                  className={`border-t ${errors.district ? 'border-red-500' : 'border-gray-300'} border-b border-r rounded-r-lg px-3 flex items-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black`}
                  onClick={() => setShowDistrictDropdown((v) => !v)}
                  tabIndex={0}
                >
                  {showDistrictDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                </button>
              </div>
              {errors.district && <div className="text-red-500 text-xs mt-1">{errors.district}</div>}
              {showDistrictDropdown && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow z-20 max-h-48 overflow-auto">
                  {districtOptions.map((option) => (
                    <li
                      key={option}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-black ${option === district ? 'bg-gray-100 font-semibold' : ''}`}
                      onClick={() => { setDistrict(option); setShowDistrictDropdown(false); }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Issue Details Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">What's the issue?</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              className={`border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black`}
              type="text"
              placeholder="e.g., “Broken main road near hospital”"
              maxLength={300}
              value={title}
              onChange={e => setTitle(e.target.value)}
              
            />
            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
            <div className="text-xs text-gray-400 text-right mt-1">{title.length}/300</div>
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]`}
              placeholder="Provide as much detail as possible (what’s wrong, how long it's been happening, who is affected, etc.)"
              minLength={30}
              maxLength={300}
              value={description}
              onChange={e => setDescription(e.target.value)}
              
            />
            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-6 mt-6">
          <label className="block text-sm text-gray-600 mb-2">Add Photos (Optional)</label>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 cursor-pointer hover:border-black transition"
            onDrop={handlePhotoDrop}
            onDragOver={e => e.preventDefault()}
            onClick={handlePhotoClick}
          >
            <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
            <div className="text-gray-500 mb-1">Drag & drop your photos here or <span className="text-blue-600 underline">Browse</span></div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoSelect}
            />
            {photos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((file, idx) => (
                  <span key={idx} className="text-xs bg-gray-200 rounded px-2 py-1 text-gray-700">{file.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-2">Upload clear images to help authorities assess the issue faster</div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Government Sector Section */}
        <div className="mb-8 dropdown-sector relative">
          <label className="block text-sm text-gray-600 mb-2">Which government sector does this issue relate to?</label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              className={`border ${errors.sector ? 'border-red-500' : 'border-gray-300'} rounded-l-lg p-3 flex-1 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black`}
              value={sector}
              placeholder="Choose the most relevant one"
              readOnly
              tabIndex={-1}
            />
            <button
              type="button"
              className={`border-t ${errors.sector ? 'border-red-500' : 'border-gray-300'} border-b border-r rounded-r-lg px-3 flex items-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black`}
              onClick={() => setShowSectorDropdown((v) => !v)}
              tabIndex={0}
            >
              <FiChevronDown className="text-gray-400" />
            </button>
          </div>
          {showSectorDropdown && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow z-20 max-h-48 overflow-auto">
              {sectorOptions.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-black ${option === sector ? 'bg-gray-100 font-semibold' : ''}`}
                  onClick={() => { setSector(option); setShowSectorDropdown(false); }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
          {errors.sector && <div className="text-red-500 text-xs mt-1">{errors.sector}</div>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-black text-white text-lg font-semibold shadow-md hover:from-black hover:to-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Uploading images...' : 'Submit issue'}
        </button>
      </form>
    </ReactModal>
    <IssueSuccessModal
      isOpen={showSuccess}
      onClose={() => setShowSuccess(false)}
      onGoToReports={() => {
        setShowSuccess(false);
        setIsReportedClicked(false);
        // Add navigation logic here if needed
      }}
    />
    </>
  );
}
