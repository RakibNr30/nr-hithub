import Modal from 'react-bootstrap/Modal';

const DefaultModal = ({title, show, handleClose, children}) => {
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DefaultModal;