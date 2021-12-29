function Pagination({ prevPage, nextPage, numPages, currentPage, onPageClick }) {
    let pages = [];
    for (let i = 0; i < numPages; i++) {
        const item = (
            <li
                key={i}
                className={`${currentPage === i + 1 ? 'active' : 'waves-effect'}`}
                onClick={() => onPageClick(i)}
            >
                <a href="#!">{i + 1}</a>
            </li>
        );
        pages.push(item);
    }

    return (
        <ul className="pagination">
            <li className={`${currentPage === 1 ? 'disabled' : 'waves-effect'}`}>
                <a href="#!" onClick={prevPage}>
                    <i className="material-icons">chevron_left</i>
                </a>
            </li>
            {pages}
            <li className={`${currentPage >= numPages ? 'disabled' : 'waves-effect'}`}>
                <a href="#!" onClick={nextPage}>
                    <i className="material-icons">chevron_right</i>
                </a>
            </li>
        </ul>
    );
}

export default Pagination;
