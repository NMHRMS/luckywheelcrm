import React from 'react';
import { Table, Modal } from 'antd';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
  
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  
    return `${day}/${month}/${year}`;
  };

const LeadtrackModal = ({ 
  visible, 
  onClose, 
  lead, 
  history, 
  reviews 
}) => {
  // History table columns
  const historyColumns = [
    {
      title: 'Assigned To',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedByName',
      key: 'assignedByName',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Date',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
    //   render: (text) => new Date(text).toLocaleString()
    render: formatDateTime
    },
    {
      title: 'Duration',
      dataIndex: 'leadDurationFormatted',
      key: 'leadDurationFormatted'
    }
  ];

  // Reviews table columns
  const reviewColumns = [
    {
      title: 'Review Date',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
    //   render: (text) => new Date(text).toLocaleDateString()
    render: formatDateTime
    },
    {
      title: 'Follow-up Date',
      dataIndex: 'followUpDate',
      key: 'followUpDate',
    //   render: (text) => new Date(text).toLocaleDateString()
    render: formatDateTime
    },
    {
      title: 'Comments',
      dataIndex: 'review',
      key: 'review',
      render: (text) => text || 'No comments'
    }
  ];

  return (
    <Modal
      title={`Lead Details - ${lead?.ownerName || 'Unknown'}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="mb-4">
        <p><strong>Mobile:</strong> {lead?.mobileNo || 'N/A'}</p>
        <p><strong>Vehicle Model:</strong> {lead?.modelName || 'N/A'}</p>
        <p><strong>Registration:</strong> {lead?.registrationNo || 'N/A'}</p>
      </div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            className="nav-link active" 
            data-bs-toggle="tab" 
            data-bs-target="#history"
          >
            Assignment History
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link" 
            data-bs-toggle="tab" 
            data-bs-target="#reviews"
          >
            Reviews
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        <div className="tab-pane show active" id="history">
          <Table
            columns={historyColumns}
            dataSource={history}
            rowKey="trackId"
            pagination={false}
            locale={{ emptyText: 'No assignment history found' }}
          />
        </div>

        <div className="tab-pane" id="reviews">
          <Table
            columns={reviewColumns}
            dataSource={reviews}
            rowKey="leadReviewId"
            pagination={false}
            locale={{ emptyText: 'No reviews found for this lead' }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default LeadtrackModal;