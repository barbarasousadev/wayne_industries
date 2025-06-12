CREATE DATABASE wayne_industries;
USE wayne_industries;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(30) NOT NULL,
  tipo_usuario ENUM('funcionario', 'gerente', 'admin') NOT NULL
);

INSERT INTO users (nome, email, senha, tipo_usuario)
VALUES 
('Bruce Wayne', 'bruce@wayne.com', '123456', 'admin'),
('Lucius Fox', 'lucius@wayne.com', '123456', 'gerente'),
('Selina Kyle', 'selina@wayne.com', '123456', 'funcionario');

CREATE TABLE equipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100)
);

CREATE TABLE recursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  tipo ENUM('equipamento', 'veiculo', 'dispositivo'),
  status VARCHAR(50),
  equipe_id INT,
  FOREIGN KEY (equipe_id) REFERENCES equipes(id)
);

INSERT INTO recursos (nome, tipo, status)
VALUES 
  ('Batmóvel', 'veiculo', 'ativo'),
  ('Detector de movimento', 'dispositivo', 'em manutenção'),
  ('Uniforme tático', 'equipamento', 'ativo');
  
CREATE TABLE relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  recurso_id INT,
  equipe_id INT,
  usuario_id INT,
  FOREIGN KEY (recurso_id) REFERENCES recursos(id),
  FOREIGN KEY (equipe_id) REFERENCES equipes(id),
  FOREIGN KEY (usuario_id) REFERENCES users(id)
);

INSERT INTO relatorios (titulo, descricao, recurso_id, equipe_id, usuario_id)
VALUES
('Inspeção dos Veículos de Patrulha', 'Todos os veículos da frota foram inspecionados...', 1, NULL, 2),
('Manutenção - Equipamentos Táticos', '5 coletes enviados para manutenção.', 3, NULL, 3),
('Falha no Sistema', 'Falha identificada nas câmeras da ala norte.', 2, NULL, 2);

ALTER TABLE relatorios ADD status VARCHAR(20) DEFAULT 'pendente';

INSERT INTO equipes (nome) VALUES 
('Equipe Tática'),
('Equipe de Manutenção'),
('Equipe de Vigilância');

UPDATE recursos SET equipe_id = 1 WHERE nome = 'Batmóvel'; -- Equipe Tática
UPDATE recursos SET equipe_id = 2 WHERE nome = 'Detector de movimento'; -- Equipe de Manutenção
UPDATE recursos SET equipe_id = 1 WHERE nome = 'Uniforme tático'; -- Equipe Tática

SET SQL_SAFE_UPDATES = 1;

SELECT * FROM users;

ALTER TABLE users MODIFY senha VARCHAR(100);
SELECT * FROM usuarios WHERE id = 5;

SELECT * FROM users WHERE id = 5;
SELECT email, senha FROM users WHERE email = 'bruce@wayne.com';
SELECT email, senha FROM users WHERE email = 'bruce@wayne.com';
DELETE FROM users WHERE email = 'bruce@wayne.com';
SET SQL_SAFE_UPDATES = 0;
SET SQL_SAFE_UPDATES = 1;
SELECT * FROM recursos;

INSERT INTO relatorios (titulo, descricao, recurso_id, equipe_id, usuario_id) 
VALUES 
('Revisão das Medidas de Segurança', 
 'Os procedimentos de segurança foram revisados e atualizados para melhor proteção das instalações das Indústrias Wayne.', 
 2, NULL, 8);
 
INSERT INTO users (nome, email, senha, tipo_usuario) 
VALUES ('Barbara Gordon', 'barbara@wayne.com', 'batgirl123', 'gerente');
INSERT INTO users (nome, email, senha, tipo_usuario) 
VALUES ('Tim Drake', 'tim@wayne.com', 'robin456', 'funcionario');
INSERT INTO recursos (nome, tipo, status, equipe_id) 
VALUES ('Drone de Vigilância', 'dispositivo', 'ativo', 3);
INSERT INTO recursos (nome, tipo, status, equipe_id) 
VALUES ('Motocicleta Tática', 'veiculo', 'em manutenção', 1);

