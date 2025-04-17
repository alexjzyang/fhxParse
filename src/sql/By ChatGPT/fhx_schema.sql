
-- SCHEMA METADATA
CREATE TABLE schema_metadata (
  id SERIAL PRIMARY KEY,
  version INTEGER,
  major_version INTEGER,
  minor_version INTEGER,
  maintenance_version INTEGER,
  build_version INTEGER,
  build_id VARCHAR(20),
  version_str VARCHAR(100),
  online_upgrade BOOLEAN,
  user_id VARCHAR(50),
  timestamp TIMESTAMP
);

-- LOCALE
CREATE TABLE locales (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  timestamp TIMESTAMP,
  locale_str VARCHAR(100)
);

-- ENUMERATION SETS
CREATE TABLE enumeration_sets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  is_fixed BOOLEAN,
  description TEXT,
  category VARCHAR(100),
  default_value INTEGER
);

CREATE TABLE enum_entries (
  id SERIAL PRIMARY KEY,
  enum_set_id INTEGER REFERENCES enumeration_sets(id) ON DELETE CASCADE,
  value INTEGER,
  name VARCHAR(100),
  selectable BOOLEAN DEFAULT TRUE
);

-- PLANT AREA
CREATE TABLE plant_areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  index INTEGER,
  sequence_number INTEGER
);

-- SIGNATURE POLICY
CREATE TABLE signature_policies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  default_action VARCHAR(50)
);

CREATE TABLE signature_parameters (
  id SERIAL PRIMARY KEY,
  policy_id INTEGER REFERENCES signature_policies(id) ON DELETE CASCADE,
  name VARCHAR(100),
  action VARCHAR(50)
);

-- FUNCTION BLOCKS
CREATE TABLE fb_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description TEXT
);

CREATE TABLE fb_definitions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  category VARCHAR(100),
  user_id VARCHAR(50),
  timestamp TIMESTAMP
);

CREATE TABLE fb_blocks (
  id SERIAL PRIMARY KEY,
  definition_id INTEGER REFERENCES fb_definitions(id) ON DELETE CASCADE,
  name VARCHAR(100),
  type VARCHAR(50),
  description TEXT
);

-- ATTRIBUTES
CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(50),
  group_name VARCHAR(50)
);

CREATE TABLE attribute_instances (
  id SERIAL PRIMARY KEY,
  block_id INTEGER REFERENCES fb_blocks(id) ON DELETE CASCADE,
  attribute_id INTEGER REFERENCES attributes(id),
  value TEXT
);

-- ALGORITHMS AND GRAPHICS
CREATE TABLE algorithms (
  id SERIAL PRIMARY KEY,
  definition_id INTEGER REFERENCES fb_definitions(id) ON DELETE CASCADE,
  type VARCHAR(10)  -- FBD or SFC
);

CREATE TABLE graphics_text (
  id SERIAL PRIMARY KEY,
  algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
  name VARCHAR(100),
  origin_x INTEGER,
  origin_y INTEGER,
  end_x INTEGER,
  end_y INTEGER,
  text TEXT
);

CREATE TABLE graphics_box (
  id SERIAL PRIMARY KEY,
  algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
  name VARCHAR(100),
  x INTEGER,
  y INTEGER,
  w INTEGER,
  h INTEGER
);

-- SFC LOGIC
CREATE TABLE sfc_steps (
  id SERIAL PRIMARY KEY,
  algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
  name VARCHAR(100),
  description TEXT,
  rectangle_x INTEGER,
  rectangle_y INTEGER,
  rectangle_w INTEGER,
  rectangle_h INTEGER
);

CREATE TABLE sfc_actions (
  id SERIAL PRIMARY KEY,
  step_id INTEGER REFERENCES sfc_steps(id) ON DELETE CASCADE,
  name VARCHAR(100),
  description TEXT,
  action_type VARCHAR(50),
  qualifier VARCHAR(10),
  expression TEXT,
  delay_time INTEGER,
  confirm_expression TEXT,
  confirm_timeout INTEGER,
  delay_expression TEXT
);

CREATE TABLE sfc_transitions (
  id SERIAL PRIMARY KEY,
  algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
  name VARCHAR(100),
  description TEXT,
  position_x INTEGER,
  position_y INTEGER,
  termination BOOLEAN,
  expression TEXT
);

CREATE TABLE sfc_connections (
  id SERIAL PRIMARY KEY,
  step_id INTEGER REFERENCES sfc_steps(id),
  transition_id INTEGER REFERENCES sfc_transitions(id),
  connection_type VARCHAR(20) -- STEP_TO_TRANSITION, TRANSITION_TO_STEP
);
