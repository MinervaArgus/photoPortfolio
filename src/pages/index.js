import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Box, Grid, VStack, Image, Button, Input } from '@chakra-ui/react';
import { CloudUpload } from '@mui/icons-material';

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = encodeURIComponent(file.name);

    const { error, data } = await supabase.storage
      .from('art-portfolio')
      .upload(`public/${fileName}`, file);

    if (error) {
      console.error('Error uploading image:', error);
    } else {
      const { publicURL } = supabase.storage.from('art-portfolio');
      const imageURL = publicURL(data.Key);
      setUploadedImages([...uploadedImages, imageURL]);
    }
  };

  return (
    <Box minHeight="100vh" bgGradient="linear(to-br, black, blue, purple)" p={8}>
      <VStack spacing={6} align="start">
        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Art Portfolio</h1>
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          hidden
          id="upload-button"
        />
        <Button
          leftIcon={<CloudUpload />}
          colorScheme="teal"
          htmlFor="upload-button"
          as="label"
        >
          Upload Image
        </Button>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {uploadedImages.map((url, index) => (
            <Image key={index} src={url} borderRadius="lg" />
          ))}
        </Grid>
      </VStack>
    </Box>
  );
}