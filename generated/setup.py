from setuptools import setup, find_packages

setup(
    name="orbitrace",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "requests",
        "protobuf",
    ],
    description="Orbitrace client for Python",
    author="Orbitrace Team",
    author_email="info@orbitrace.ai",
    url="https://orbitrace.ai",
)