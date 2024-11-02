import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout

base_dir = 'dataset/Depression Data/data'
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')

# stressed and not stressed dataset split
stressed_emotions = ['Angry', 'Disgust', 'Fear', 'Sad']
not_stressed_emotions = ['Happy', 'Neutral', 'Surprize']

# Use ImageDataGenerator to preprocess and load data
train_datagen = ImageDataGenerator(rescale=1.0/255, horizontal_flip=True, rotation_range=10)
val_datagen = ImageDataGenerator(rescale=1.0/255)

def create_data_generators(stressed, not_stressed, train_path, val_path):
    train_data = train_datagen.flow_from_directory(
        train_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='binary',
        classes={'Stressed': stressed, 'Not Stressed': not_stressed},
        subset='training'
    )
    val_data = val_datagen.flow_from_directory(
        val_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='binary',
        classes={'Stressed': stressed, 'Not Stressed': not_stressed},
    )
    return train_data, val_data

train_data, val_data = create_data_generators(stressed_emotions, not_stressed_emotions, train_dir, val_dir)

# simple CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# Compile
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train
history = model.fit(train_data, validation_data=val_data, epochs=10)

# Save
model.save('stress_detection_model.h5')

print("Model training complete. Saved as 'stress_detection_model.h5'")
