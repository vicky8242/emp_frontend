import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Props {
  projEditObj: Project | undefined;
  setProjEditObj: React.Dispatch<React.SetStateAction<Project | undefined>>;
}

const ViewProjectTable: React.FC<Props> = ({ projEditObj, setProjEditObj }) => {
  const [data, setData] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Project[]>("https://empbackend.base2brand.com/get/projects", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    }).then((response) => {
      const sortedData = response.data.sort(
        (a, b) => Number(b.ProID) - Number(a.ProID)
      );
      setData(sortedData);
    });
  }, []);

  const handleEdit = (ProID: string | number) => {
    const filteredObj = data.find((obj) => obj.ProID === ProID);
    if (filteredObj) {
      setProjEditObj(filteredObj);
      navigate("/add-project", { state: { projEditObj: filteredObj } });
    }
  };

  const handleDelete = (projectName: string) => {
    axios.delete(`https://empbackend.base2brand.com/project/${projectName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });

    setData(data.filter((project) => project.projectName !== projectName));
  };

  const filteredData = data.filter(project =>
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Project) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.ProID)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.projectName)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="search-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
            <label>Search by Client or Project:</label>
            <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Client or Project Name"
                style={{ marginLeft: 10 }}
            />
        </div>
      </div>
      <Table
        style={{ width: "80vw" }}
        dataSource={filteredData}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default ViewProjectTable;
