import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";

interface Module {
  projectName: string;
  phaseName: string;
  modules: string[];
}

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}
type Phase = {
  phaseID: number;
  projectName: string;
};

const AddModule: React.FC<any> = ({ navigation, classes }) => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
const [phases, setPhases] = useState<Phases[]>([]);
const [selectedProject, setSelectedProject] = useState<string>("");
const [selectedPhase, setSelectedPhase] = useState<string>("");
const [module, setModule] = useState<Module>({
  projectName: "",
  phaseName: "",
  modules: ["", ""],
});


  const navigate = useNavigate();

  const { modulejEditObj, setModulejEditObj } = useContext(GlobalInfo);


  useEffect(() => {
    axios
      .get<Project[]>("https://empbackend.base2brand.com/get/projects",{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        setProjectNames(response.data.map((project) => project.projectName));
      });
  }, []);

  useEffect(() => {
    axios.get<Phases[]>("https://empbackend.base2brand.com/get/phases",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      }
    })
    .then((response) => {
      setPhases(response.data);
    });
  }, []);

  const handleModuleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    moduleIndex: number
  ) => {
    const { value } = event.target;
    const updatedModules = [...module.modules];
    updatedModules[moduleIndex] = value;
    setModule({
      ...module,
      modules: updatedModules,
    });
  };

  const handleAddModule = () => {
    setModule({
      ...module,
      modules: [...module.modules, ""],
    });
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...module.modules];
    updatedModules.splice(index, 1);
    setModule({
      ...module,
      modules: updatedModules,
    });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const currentPhase = phases.find((phase) => phase.projectName === value);
    if (currentPhase) {
      setSelectedPhase(currentPhase.phases[0]);
      setModule({
        projectName: value,
        phaseName: currentPhase.phases[0],
        modules: ["", ""],
      });
    } else {
      setSelectedPhase("");
      setModule({

        projectName: value,
        phaseName: "",
        modules: ["", ""],
      });
    }
  };

  const handlePhaseChange = (value: string) => {
    setSelectedPhase(value);
    setModule({
      ...module,
      phaseName: value,
    });
  };

  const handleSubmit = () => {
    axios
      .post("https://empbackend.base2brand.com/api/add-module", module, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        console.log(response.data);
        navigate("/view-module");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div className="add-div">
              <p className="add-heading">Add Module</p>
              <label className="add-label">
                Project Name<span style={{ color: "red" }}>*</span>
              </label>

              <select
                // onChange={handleChange}
                className="add-input"
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select a project</option>
                {projectNames.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>

              {/* <input className="add-input" name="projectName" value={module.projectName} onChange={handleModuleChange} /> */}
              <label className="add-label">
                Phase<span style={{ color: "red" }}>*</span>
              </label>
              {/* {selectedProject && ( */}
              <select
                className="add-input"
                id="phase"
                name="phase"
                value={selectedPhase}
                onChange={(e) => handlePhaseChange(e.target.value)}
              >
                <option value="">Select a phase</option>
                {phases
                  .filter((phase) => phase.projectName === selectedProject)
                  .map((phase) => {
                    return (
                      <React.Fragment key={phase.phaseID}>
                        <option value={phase.phases}>{phase.phases}</option>
                      </React.Fragment>
                    );
                  })}
              </select>
              {/* )} */}

              <div>
                <label className="add-label">
                  Modules <span style={{ color: "red" }}>*</span>
                </label>

                {
                // !modulejEditObj &&
                 module?.modules.map((moduleName, index) => (
                  <div style={{ display: "flex" }} key={index}>
                    <input
                      className="add-input"
                      type="text"
                      value={moduleName}
                      onChange={(event) =>
                        handleModuleChange(
                          event,
                          index,
                          module.modules.indexOf(moduleName)
                        )
                      }
                    />
                    {index !== 0 && (
                      <div
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          marginTop: "16px",
                        }}
                        onClick={() => handleRemoveModule(index)}
                      >
                        <MinusCircleOutlined rev={undefined} />
                      </div>
                    )}
                    {index === module.modules.length - 1 && (
                      <div
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          marginTop: "16px",
                        }}
                        onClick={handleAddModule}
                      >
                        <PlusCircleOutlined rev={undefined} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="add-button" onClick={handleSubmit}>
                Add Module
              </button>
            </div>
            <div style={{ marginTop: "50px", height: "80%", width: "100%" }}>
              {/* <EmployeeTable /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModule;
