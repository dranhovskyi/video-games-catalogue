import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type {VideoGame} from '../types/VideoGame';
import { videoGameService } from '../services/videoGameService';
import VideoGameCard from '../components/VideoGameCard';

const BrowsePage: React.FC = () => {
    const [videoGames, setVideoGames] = useState<VideoGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVideoGames();
    }, []);

    const loadVideoGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const games = await videoGameService.getAll();
            setVideoGames(games);
        } catch (err) {
            setError('Failed to load video games. Please try again.');
            console.error('Error loading video games:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this game?')) {
            try {
                await videoGameService.delete(id);
                setVideoGames(videoGames.filter(game => game.id !== id));
            } catch (err) {
                setError('Failed to delete video game. Please try again.');
                console.error('Error deleting video game:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Video Games Catalog</h1>
                <Button as={Link as any} to="/edit" variant="success">
                    Add New Game
                </Button>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {videoGames.length === 0 ? (
                <Alert variant="info">
                    No video games found. <Link to="/edit">Add one now!</Link>
                </Alert>
            ) : (
                <Row>
                    {videoGames.map((game) => (
                        <Col key={game.id} md={6} lg={4} className="mb-4">
                            <VideoGameCard videoGame={game} onDelete={handleDelete} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default BrowsePage;