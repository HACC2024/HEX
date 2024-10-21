# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application files into the container
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run your application
CMD ["python", "app.py"]
