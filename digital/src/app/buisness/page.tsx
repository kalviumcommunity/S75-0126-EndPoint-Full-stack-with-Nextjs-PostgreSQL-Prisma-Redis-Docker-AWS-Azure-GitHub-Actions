import React from 'react';

const CreateBusinessPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create Business</h1>
      {/* Form to create a new business */}
      <form>
        <div>
          <label>Name:</label>
          <input type="text" placeholder="Business Name" />
        </div>
        <div>
          <label>Description:</label>
          <textarea placeholder="Business Description" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBusinessPage;
