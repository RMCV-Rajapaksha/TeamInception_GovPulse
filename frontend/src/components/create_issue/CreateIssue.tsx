import React, { useRef, useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
  };

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-grama')) setShowGramaDropdown(false);
      if (!target.closest('.dropdown-city')) setShowCityDropdown(false);
      if (!target.closest('.dropdown-district')) setShowDistrictDropdown(false);
    };
    if (showGramaDropdown || showCityDropdown || showDistrictDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showGramaDropdown, showCityDropdown, showDistrictDropdown]);

  return (
    <ReactModal
      isOpen={isReportedClicked}
      onRequestClose={() => setIsReportedClicked(false)}
      overlayClassName="fixed inset-0 bg-black/60 z-[1000]"
      className="fixed inset-0 w-screen h-screen bg-white rounded-none shadow-xl outline-none flex flex-col md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2 md:inset-auto md:w-[min(92vw,32rem)] md:h-auto md:max-h-[90vh] md:rounded-2xl"
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
            <button
              type="button"
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-black flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => setShowGramaDropdown((v) => !v)}
            >
              <span className="text-black">{grama}</span>
              <span>{showGramaDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}</span>
            </button>
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
          <div className="flex gap-3 mb-2">
            {/* City / Town Dropdown */}
            <div className="flex-1 dropdown-city relative">
              <label className="block text-sm text-gray-600 mb-1">City / Town</label>
              <button
                type="button"
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-black flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black"
                onClick={() => setShowCityDropdown((v) => !v)}
              >
                <span className="text-black">{city}</span>
                <span>{showCityDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}</span>
              </button>
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
              <button
                type="button"
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-black flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black"
                onClick={() => setShowDistrictDropdown((v) => !v)}
              >
                <span className="text-black">{district}</span>
                <span>{showDistrictDropdown ? <FiChevronDown className="rotate-180 text-gray-400" /> : <FiChevronDown className="text-gray-400" />}</span>
              </button>
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
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              placeholder="e.g., “Broken main road near hospital”"
              maxLength={300}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <div className="text-xs text-gray-400 text-right mt-1">{title.length}/300</div>
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
              placeholder="Provide as much detail as possible (what’s wrong, how long it's been happening, who is affected, etc.)"
              minLength={30}
              maxLength={300}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            <div className="text-xs text-gray-400 mt-1">Description must be at least 30 characters.</div>
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
        <div className="mb-8">
          <label className="block text-sm text-gray-600 mb-2">Which government sector does this issue relate to?</label>
          <div className="relative">
            <select
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 bg-gray-100 pr-10 focus:outline-none appearance-none"
              value={sector}
              onChange={e => setSector(e.target.value)}
              required
            >
              <option value="" disabled>Choose the most relevant one</option>
              {sectorOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-black text-white text-lg font-semibold shadow-md hover:from-black hover:to-gray-800 transition"
        >
          Submit issue
        </button>
      </form>
    </ReactModal>
  );
}
