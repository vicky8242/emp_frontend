import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

const EditAddPhase: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [phaseName, setPhaseName] = useState<string>("");
  const [data, setData] = useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  console.log(location?.state?.phaseEditObj,"gggg----");

  useEffect(() => {
    if (location?.state?.phaseEditObj) {
      setProjectName(location.state.phaseEditObj.projectName);
      setPhaseName(location.state.phaseEditObj.phases); // Changed this line
    }
  }, [location.state]);

  const projectNames = data.map((e) => {
    return e.projectName;
  });

  useEffect(() => {
    axios.get<Project[]>("https://empbackend.base2brand.com/get/projects",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      }
    })
      .then((response) => {
        setData(response.data);
      });
  }, []);

  const handlePhaseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPhaseName(value);
  };

  const handleSubmit = () => {
    if (!projectName || !phaseName) {
      alert("Please fill all credentials");
      return;
    }

    const data = {
      projectName,
      phases: [phaseName],
    };

    if (location.state.phaseEditObj) {
      axios.put(`https://empbackend.base2brand.com/api/update-phase/${location.state.phaseEditObj.phaseID}`, data,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        if (response.data === "OK") {
          navigate("/view-phase");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.error(error);
        }
      });
    }
  };

  return (
    <div className="emp-main-div">
      <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
        <div style={{height: "8%"}}>
          <Navbar />
        </div>
        <div style={{display: "flex", flexDirection: "row", height: "90%"}}>
          <div className="menu-div">
            <Menu />
          </div>
          <div style={{display: "flex", flexDirection: "column"}} className="form-container">
            <div className="add-div">
              <p className="add-heading">Edit Phase</p>
              <label className="add-label">Project<span style={{color: "red"}}>*</span></label>
              <select className="add-input" value={projectName} disabled>
                <option value="">Select a project</option>
                {projectNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <label className="add-label">Phase Name<span style={{color: "red"}}>*</span></label>
              <input className="add-input" value={phaseName} onChange={handlePhaseNameChange} />
              <button className="add-button" onClick={handleSubmit}>Submit</button>
            </div>
            <div style={{width: "90%", height: "80%", marginTop: "3%"}}>
              {/* You can add other components or information display here. */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddPhase;
