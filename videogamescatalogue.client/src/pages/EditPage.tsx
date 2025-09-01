import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import type {CreateVideoGame} from '../types/CreateVideoGame';
import type {UpdateVideoGame} from '../types/UpdateVideoGame';
import { videoGameService } from '../services/videoGameService';
import { validateVideoGame } from '../utils/validation';

const EditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateVideoGame | UpdateVideoGame>({
        title: '',
        genre: '',
        platform: '',
        releaseDate: '',
        developer: '',
        publisher: '',
        rating: 0,
        description: '',
    });

    useEffect(() => {
        if (isEditing && id) {
            loadVideoGame(parseInt(id));
        }
    }, [id, isEditing]);

    const loadVideoGame = async (gameId: number) => {
        try {
            setLoading(true);
            setError(null);
            const game = await videoGameService.getById(gameId);
            setFormData({
                title: game.title,
                genre: game.genre,
                platform: game.platform,
                releaseDate: game.releaseDate.split('T')[0], // Convert to YYYY-MM-DD format
                developer: game.developer,
                publisher: game.publisher,
                rating: game.rating,
                description: game.description,
            });
        } catch (err) {
            setError('Failed to load video game. Please try again.');
            console.error('Error loading video game:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateVideoGame(formData);
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (isEditing && id) {
                await videoGameService.update(parseInt(id), formData as UpdateVideoGame);
            } else {
                await videoGameService.create(formData as CreateVideoGame);
            }

            navigate('/');
        } catch (err: any) {
            let errorMessage = isEditing ? 'Failed to update video game.' : 'Failed to create video game.';

            // Handle specific API errors
            if (err.response?.status === 400) {
                errorMessage = 'Please check your input and try again.';
            } else if (err.response?.status === 404) {
                errorMessage = 'Video game not found.';
            } else if (err.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }

            setError(errorMessage);
            console.error('Error saving video game:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleReset = () => {
        if (isEditing && id) {
            loadVideoGame(parseInt(id));
        } else {
            setFormData({
                title: '',
                genre: '',
                platform: '',
                releaseDate: '',
                developer: '',
                publisher: '',
                rating: 0,
                description: '',
            });
        }
        setError(null);
    };

    if (loading && isEditing) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading video game...</p>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditing ? 'Edit Video Game' : 'Add New Video Game'}</h1>
                <Button variant="secondary" onClick={handleCancel}>
                    Back to Catalog
                </Button>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    <Alert.Heading>Error</Alert.Heading>
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                maxLength={100}
                                placeholder="Enter game title"
                                isInvalid={!formData.title?.trim() && formData.title !== ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                Title is required
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                maxLength={50}
                                placeholder="e.g., Action, RPG, Strategy"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Platform</Form.Label>
                            <Form.Control
                                type="text"
                                name="platform"
                                value={formData.platform}
                                onChange={handleInputChange}
                                maxLength={50}
                                placeholder="e.g., PC, PlayStation 5, Xbox Series X"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Developer</Form.Label>
                            <Form.Control
                                type="text"
                                name="developer"
                                value={formData.developer}
                                onChange={handleInputChange}
                                maxLength={50}
                                placeholder="e.g., Naughty Dog, Nintendo"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Publisher</Form.Label>
                            <Form.Control
                                type="text"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleInputChange}
                                maxLength={50}
                                placeholder="e.g., Sony, Microsoft, Nintendo"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rating (0-10)</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder="0.0"
                                isInvalid={formData.rating < 0 || formData.rating > 10}
                            />
                            <Form.Control.Feedback type="invalid">
                                Rating must be between 0 and 10
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Enter a rating from 0.0 to 10.0
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Characters Remaining</Form.Label>
                            <div className="text-muted small">
                                {500 - (formData.description?.length || 0)} characters remaining
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={500}
                        placeholder="Enter a description of the game..."
                        isInvalid={formData.description?.length > 500}
                    />
                    <Form.Control.Feedback type="invalid">
                        Description must be 500 characters or less
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2 justify-content-start">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !formData.title?.trim()}
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                {isEditing ? '💾 Update Game' : '➕ Create Game'}
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleReset}
                        disabled={loading}
                        size="lg"
                    >
                        🔄 Reset
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={loading}
                        size="lg"
                    >
                        ❌ Cancel
                    </Button>
                </div>
            </Form>

            {/* Form Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                    <summary className="text-muted">Debug: Form Data</summary>
                    <pre className="bg-light p-2 mt-2 small">
            {JSON.stringify(formData, null, 2)}
          </pre>
                </details>
            )}
        </>
    );
};

export default EditPage;