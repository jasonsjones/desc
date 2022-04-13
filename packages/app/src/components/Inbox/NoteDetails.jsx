const NoteDetails = ({ note }) => {
    const { first, last } = note.submittedBy.name;
    return (
        <p style={{ margin: '.125rem 0' }}>
            <span style={{ fontWeight: 'bold' }}>{`${first} ${last}: `}</span> {note.body}
        </p>
    );
};

export default NoteDetails;
