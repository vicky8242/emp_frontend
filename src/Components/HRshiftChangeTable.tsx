import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";

interface ShiftChangeData {
    ShiftChangeTableID : 0,
    employeeName: string;
    employeeID: string;
    applyDate: string;
    inTime: string;
    outTime: string;
    reason: string;
    currDate: Date;
    teamLead: string;
    adminID: string;
    approvalOfTeamLead: string;
    approvalOfHR: string;
}

const HRshiftChangeTable : React.FC = () => {
  const [data, setData] = useState<ShiftChangeData[]>([]);
  // const navigate = useNavigate();
  useEffect(() => {
    axios
      .get<ShiftChangeData[]>("https://empbackend.base2brand.com/get/changeShiftInfo",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      }
    )
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );

        setData(sortedData);
      });
  }, []);

const handleApprove = (ShiftChangeTableID: number) => {
  const token = localStorage.getItem("myToken");

    axios
      .put(`https://empbackend.base2brand.com/approveShiftChangeHR/${ShiftChangeTableID}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error approving leave data:", error);
      });
  };
  const handleDeny = (ShiftChangeTableID: number) => {
    // Get the token from local storage
    const token = localStorage.getItem("myToken");

    axios
      .put(`https://empbackend.base2brand.com/denyShiftChangeHR/${ShiftChangeTableID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying leave data:", error);
      });
  };

  const fetchData = () => {
    axios
      .get<ShiftChangeData[]>("https://empbackend.base2brand.com/get/changeShiftInfo",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      }
    )
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );
        setData(sortedData);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

const columns = [
    {
        title: "Team Lead",
        dataIndex: "teamLead",
        key: "teamLead",
        render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
      },
      {
        title: "In time",
        dataIndex: "inTime",
        key: "inTime",
        render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
      },
      {
        title: "Out time ",
        dataIndex: "outTime",
        key: "outTime",
        render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        render: (text: string) => <div style={{ width: 250 }}>{text}</div>,
      },


      {
        title: "Status (TL)",
        dataIndex: "approvalOfTeamLead",
        key: "approvalOfTeamLead",
        render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
      },
      {
        title: "Status (HR)",
        dataIndex: "approvalOfHR",
        key: "approvalOfHR",
        render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
      },
    {
      title: "Action",
      render: (text: number, record: ShiftChangeData) => (
        <div style={{ width: 200 }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record.ShiftChangeTableID)}
            style={{ marginRight: 10 }}
          >
            Approve
          </Button>
          <Button type="default" danger onClick={() => handleDeny(record.ShiftChangeTableID)}>
            Deny
          </Button>
        </div>
      ),
    }

  ];

  return (
    <>
      <Table
        style={{ width: "80vw" }}
        dataSource={data}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default HRshiftChangeTable;
