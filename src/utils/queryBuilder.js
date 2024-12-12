class QueryBuilder {
  constructor() {
    this.query = '';
    this.params = [];
    this.paramCount = 0;
  }

  select(fields = '*') {
    this.query = `SELECT ${Array.isArray(fields) ? fields.join(', ') : fields}`;
    return this;
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(conditions) {
    if (Object.keys(conditions).length > 0) {
      const whereConditions = Object.entries(conditions)
        .map(([key, value]) => {
          this.paramCount++;
          this.params.push(value);
          return `${key} = $${this.paramCount}`;
        })
        .join(' AND ');
      
      this.query += ` WHERE ${whereConditions}`;
    }
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.query += ` ORDER BY ${field} ${direction}`;
    return this;
  }

  limit(limit) {
    if (limit) {
      this.paramCount++;
      this.params.push(limit);
      this.query += ` LIMIT $${this.paramCount}`;
    }
    return this;
  }

  offset(offset) {
    if (offset) {
      this.paramCount++;
      this.params.push(offset);
      this.query += ` OFFSET $${this.paramCount}`;
    }
    return this;
  }

  build() {
    return {
      text: this.query,
      values: this.params
    };
  }
}

module.exports = QueryBuilder;