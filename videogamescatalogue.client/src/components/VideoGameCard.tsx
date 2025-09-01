import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import type {VideoGame} from '../types/VideoGame';
import { Link } from 'react-router-dom';

interface Props {
    videoGame: VideoGame;
    onDelete: (id: number) => void;
}

const VideoGameCard: React.FC<Props> = ({ videoGame, onDelete }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getRatingVariant = (rating: number) => {
        if (rating >= 9) return 'success';
        if (rating >= 7) return 'primary';
        if (rating >= 5) return 'warning';
        return 'danger';
    };

    return (
        <Card className="h-100">
            <Card.Body>
                <Card.Title>{videoGame.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {videoGame.developer} • {formatDate(videoGame.releaseDate)}
                </Card.Subtitle>

                <div className="mb-2">
                    <Badge bg="secondary" className="me-1">{videoGame.genre}</Badge>
                    <Badge bg="info">{videoGame.platform}</Badge>
                </div>

                <div className="mb-2">
                    <Badge bg={getRatingVariant(videoGame.rating)}>
                        Rating: {videoGame.rating}/10
                    </Badge>
                </div>

                <Card.Text>
                    {videoGame.description.length > 100
                        ? `${videoGame.description.substring(0, 100)}...`
                        : videoGame.description}
                </Card.Text>
            </Card.Body>

            <Card.Footer>
                <div className="d-flex justify-content-between">
                    <Button
                        as={Link as any}
                        to={`/edit/${videoGame.id}`}
                        variant="primary"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(videoGame.id)}
                    >
                        Delete
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default VideoGameCard;