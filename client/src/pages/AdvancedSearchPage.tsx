import { useEffect, useState } from "react";
import { Type } from "../models/Type";
import DocumentAPI from "../API/DocumentAPI";
import { SearchFilter } from "../models/SearchFilter";
import { StakeHolder } from "../models/StakeHolders";
import { useNavigate } from "react-router-dom";
import AdvancedSearchForm from "../components/Forms/AdvancedSearchForm";

function AdvancedSearchPage({ onSearch }) {
  const navigate = useNavigate();
  const languages = [
    { code: "GB", label: "English" },
    {
      code: "SE",
      label: "Sweden",
    },
  ];
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [documentTypes, setDocumentTypes] = useState<Type[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    title: null,
    description: null,
    types: null,
    start_year: null,
    end_year: null,
    scales: null,
    languages: null,
    stakeholders: null,
  });

  const handleClose = () => {
    navigate("/map");
  };

  const handleSubmit = () => {
    // Remove null values from filters
    Object.keys(filters).forEach((key) => filters[key] == null && delete filters[key]);
    console.log(filters)
    onSearch(filters);
  };

  useEffect(() => {
    // Fetch document types
    DocumentAPI.getTypes()
      .then((types: Type[]) => {
        setDocumentTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
    // Fetch stakeholders
    DocumentAPI.getStakeholders()
      .then((stakeholders: StakeHolder[]) => {
        setStakeholders(stakeholders);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <AdvancedSearchForm
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      filters={filters}
      setFilters={setFilters}
      stakeholders={stakeholders}
      documentTypes={documentTypes}
      languages={languages}
    />
  );
}

export default AdvancedSearchPage;
