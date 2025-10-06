import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './search.css'; 

function Search() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState({
    gender: "",
    location: "",
    min_age: "",
    max_age: "",
    religion: "",
    caste: "",
    income: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInterests((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const print = async (e) => {
    e.preventDefault();
    try {
      console.log(selectedInterests);
      navigate('/matches', { state: selectedInterests });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={print} className="search-form">
        <fieldset className="form-fieldset">
          <legend className="form-legend">Search Filters</legend>

          <select name="gender" value={selectedInterests.gender} onChange={handleInputChange} className="form-select">
            <option value="">-- Gender--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            name="location"
            value={selectedInterests.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="form-input"
          />

          <input
            type="number"
            name="min_age"
            value={selectedInterests.min_age}
            onChange={handleInputChange}
            placeholder="Minimum Age"
            className="form-input"
          />

          <input
            type="number"
            name="max_age"
            value={selectedInterests.max_age}
            onChange={handleInputChange}
            placeholder="Maximum Age"
            className="form-input"
          />

          <select name="religion" value={selectedInterests.religion} onChange={handleInputChange} className="form-select">
            <option value="">--Religion--</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Sikh">Sikh</option>
            <option value="Christian">Christian</option>
            <option value="Jain">Jain</option>
            <option value="Buddhism">Buddhism</option>
            <option value="Other">Other</option>
          </select>

          <select name="caste" value={selectedInterests.caste} onChange={handleInputChange} className="form-select">
            <option value="">Select Caste</option>
            <option value="Brahmin">Brahmin</option>
            <option value="Rajput">Rajput</option>
            <option value="Yadav">Yadav</option>
            <option value="Kurmi">Kurmi</option>
            <option value="Ansari">Ansari</option>
            <option value="Other">Other</option>
          </select>

          {selectedInterests.caste === "Other" && (
            <input
              type="text"
              name="otherCaste"
              value={selectedInterests.otherCaste || ""}
              onChange={(e) =>
                setSelectedInterests((prev) => ({
                  ...prev,
                  caste: e.target.value,
                }))
              }
              placeholder="Enter your caste"
              className="form-input"
            />
          )}

          <input
            type="text"
            name="income"
            value={selectedInterests.income}
            onChange={handleInputChange}
            placeholder="Income"
            className="form-input"
          />

          <button type="submit" className="submit-button">Search</button>
        </fieldset>
      </form>
    </div>
  );
}

export default Search;
